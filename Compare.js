const fs = require('fs');
const mkdirp = require('mkdirp');
const moment = require('moment');
const uiWriter = require('./UIWriter');
const os = require('os');
var beautify = require("json-beautify");


module.exports = {


    start : function(beforeAllData, afterAllData, scanners){

        return new Promise(function(resolve, reject){
            
            var scannerCompareCompleted = 0;
            var scannerCompareTotal = beforeAllData.length;

            console.log(beforeAllData);

            beforeData = {};
            afterData = {};
        
            var diffs = [];
        
            beforeAllData.forEach(function(before){

                before = before[0];

                var currentScanner = null;
                beforeData = before.data;
                afterData = null;
        
             

                scanners.forEach(function(scanner) {
                    console.log(before.scanner + "==" + scanner.ScannerId)
                    if(before.scanner == scanner.ScannerId){
                        currentScanner = scanner;
                        console.log("Scaner " + currentScanner.ScannerName + " found !");                
                        return;
                    }    
                });
        
                afterAllData.forEach(function(after){

                    after = after[0];

                    if(after.scanner == before.scanner){
                        //same scanner
                        afterData = after.data;
                        console.log(afterData)
                        return;
                    }
                });
        
        
                if(currentScanner != null && afterData != null){
                    var diff = currentScanner.diff(beforeData, afterData);
                    diffs.push({ scanner : currentScanner.ScannerName, results : diff });
                }

                scannerCompareCompleted++;
               
        
            });

            resolve(diffs);
        }).then(function(compareResults){
            return compareCompleted(compareResults);
        });


        
    },   
}




compareCompleted = function(results){

    return new Promise(function(resolve, reject){
        console.log("Compare completed!")
        console.log(results);
    
        var dir = os.homedir() + "\\WinDiffer\\Results\\";
    
        mkdirp(dir, function(){
            var dateTime = moment().format("YYYYMMDD_HHmmss");
            var filename = dir+dateTime+".json";
            fs.writeFile(filename, JSON.stringify(results), function(err){ });
            uiWriter.writeToScanLog("Saved result in file : " + filename);
        });

        resolve();
    })


}



var compareFileData = function(beforeContent, afterContent){

    var beforeAllData = JSON.parse(beforeContent); 
    var afterAllData = JSON.parse(afterContent); 

    beforeData = {};
    afterData = {};

    var diffs = [];

    beforeAllData.forEach(function(before){
        var currentModule = null;
        beforeData = before.data;
        afterData = null;

        modulesManager.modules.forEach(function(element) {
            if(before.module == element.moduleId){
                currentModule = element;
                console.log("Module " + currentModule.moduleName + " found !");                
                return;
            }    
        }, this);

        afterAllData.forEach(function(after){
            if(after.module == before.module){
                //Meme module
                afterData = after.data;
                console.log("AfterData found !")
                return;
            }
        });


        if(currentModule != null && afterData != null){
            var diff = currentModule.diff(beforeData, afterData);
            diffs.push({ module : currentModule.moduleId, results : diff });
        }
       

    });

    return diffs;

}














