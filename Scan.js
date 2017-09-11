const fs = require('fs');
const mkdirp = require('mkdirp');
const moment = require('moment');
const uiWriter = require('./UIWriter');
const os = require('os');


var totalScansAmount = 0;
var completedScansAmount = 0;

module.exports = {
    launchScan : function(scanners){

        totalScansAmount = scanners.length;
        completedScansAmount = 0;
        uiWriter.resetScanLogs();

        console.log(scanners);

        var scansPromises = [];
        scanners.forEach(function(scanner){
            scansPromises.push(getScannerPromise(scanner));
        });

        return Promise.all(scansPromises).then(function(results){ 
            return scansCompleted(results);
        });       
    }
}


var getScannerPromise = function(scanner){
    return new Promise(function(resolve, reject){
        var results = [];

        scanner.scan().then(function(scanData){
            if(scanData){                        
                var data = [];

                scanData = JSON.parse(scanData);
                if(!(scanData instanceof Array)){
                    scanData = [scanData]; //Convert single object to array
                }

                scanData.forEach(function(x){
                    data.push(scanner.buildItem(x));
                })
                uiWriter.writeToScanLog("Scan completed for : " + scanner.ScannerName + ". Found " + data.length + " items");
                console.log(data);
                results.push({'scanner' : scanner.ScannerId, data});
            }
            else{
                data = [];
                console.log("No data for " + scanner.ScannerName + "scan");
                results.push({'scanner' : scanner.ScannerId, data});
                uiWriter.writeToScanLog("Scan completed for : " + scanner.ScannerName + ". No items found.");
            }

            completedScansAmount++;
            percent = (completedScansAmount)/(totalScansAmount).toPrecision(2) * 100; 
            resolve(results);


        }).catch(err => console.log(err))
    });
}



var scansCompleted = function(results){

    return new Promise(function(resolve, reject){
        console.log("Scan completed!")
        console.log(results);
    
        uiWriter.writeToScanLog("Scan completed.")
    
        var dir = os.homedir() + "\\WinDiffer\\Snapshots\\";
    
        mkdirp(dir, function(){
            var dateTime = moment().format("YYYYMMDD_HHmmss");
            var filename = dir+dateTime+".json";
            fs.writeFile(filename, JSON.stringify(results), function(err){ });
            uiWriter.writeToScanLog("Saved result in file : " + filename);
            
            resolve();
        });
    });


}






