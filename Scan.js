const fs = require('fs');
const mkdirp = require('mkdirp');
const moment = require('moment');
const uiWriter = require('./UIWriter');
const os = require('os');
const iconv = require('iconv-lite');
const fileManager = require('./FilesManager');
const trans = require('./trans');


var totalScansAmount = 0;
var completedScansAmount = 0;
var resultsComplete = [];

module.exports = {
    launchScan : function(scanners){

        resultsComplete = [];
        totalScansAmount = scanners.length;
        completedScansAmount = 0;
        uiWriter.resetScanLogs();

        console.log(scanners);
        
        var lastPromise = null;

        scanners.forEach(function(scanner){
            if(lastPromise==null){
                lastPromise = getScannerPromise(scanner);
            }
            else{
                lastPromise = lastPromise.then(function(){
                    return getScannerPromise(scanner)
                });
            }            
        });
/*
        var scansPromises = [];
        scanners.forEach(function(scanner){
            scansPromises.push(getScannerPromise(scanner));
        });

        return Promise.all(scansPromises).then(function(results){ 
            return scansCompleted(results);
        });      

        */


        return lastPromise.then(function(){
            return scansCompleted(resultsComplete);
        });
        
    }
}


var getScannerPromise = function(scanner){
    return new Promise(function(resolve, reject){
        var results = [];

        uiWriter.writeToScanLog(trans('scan.startscanfor') +  " : " + scanner.ScannerName);

        scanner.scan().then(function(){

            fileManager.getLastScanFileContent().then(function(scanData){
                if(scanData){       
                    var data = [];

                    scanData = JSON.parse(scanData.trim());
                    if(!(scanData instanceof Array)){
                        scanData = [scanData]; //Convert single object to array
                    }

                    scanData.forEach(function(x){
                        data.push(scanner.buildItem(x));
                    })
                    uiWriter.writeToScanLog((trans('scan.scancompletedfor') + " : " + scanner.ScannerName + ". " + trans('scan.found') + " " + data.length + " " + trans('scan.items') + "."));
                    console.log(data);
                    results.push({'scanner' : scanner.ScannerId, data});
                }
                else{
                    data = [];
                    console.log("No data for " + scanner.ScannerName + "scan");
                    results.push({'scanner' : scanner.ScannerId, data});
                    uiWriter.writeToScanLog((trans('scan.scancompletedfor') + " : " + scanner.ScannerName + "." + trans('scan.noitemsfound') + "."));
                }

                completedScansAmount++;
                percent = (completedScansAmount)/(totalScansAmount).toPrecision(2) * 100; 
                resultsComplete.push(results);
                resolve(results);
            });

        }).catch(err => console.log(err))
    });
}



var scansCompleted = function(results){

    return new Promise(function(resolve, reject){
        console.log("Scan completed!")
        console.log(results);
    
        uiWriter.writeToScanLog(trans('scan.scancompleted') + ".")
    
        var dir = fileManager.getSnapshotsFilesDir();
    
        mkdirp(dir, function(){
            var dateTime = moment().format("YYYYMMDD_HHmmss");
            var filename = dir+dateTime+".json";
            fs.writeFile(filename, JSON.stringify(results), function(err){ });
            uiWriter.writeToScanLog(trans('scan.savedfile') + " : " + filename);
            
            resolve();
        });
    });


}






