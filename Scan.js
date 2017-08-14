const modulesManager = require('./ModulesManager');
const fs = require('fs');
const mkdirp = require('mkdirp');
const moment = require('moment');
const uiWriter = require('./UIWriter');
const os = require('os');


module.exports = {
    launchScan : function(_callback){
        var results = [];

        var modulesToScan = [];
        $(".chk-module:checked").each(function() { modulesToScan.push(this.id) });
        console.log(modulesToScan)

        totalModules = modulesToScan.length;

        modulesScanned = 0;
        updateScanProgressBar();

        if(totalModules == 0){        
            uiWriter.writeToScanLog("No module selected.")    
            return _callback();
        }


        modulesManager.modules.forEach(function(scanModule) {

            if(!modulesToScan.includes(scanModule.moduleId)){
                return;
            }
            uiWriter.writeToScanLog("Starting scan for : " + scanModule.moduleName + ".");
            scanModule.scan().then(function(scanData){
                if(scanData){     
                    var data = [];                
                    scanData = JSON.parse(scanData);
                    scanData.forEach(function(x){
                        data.push(scanModule.buildItem(x));
                    })
                    uiWriter.writeToScanLog("Scan completed for : " + scanModule.moduleName + ". Found " + data.length + " scanModules.");
                    console.log(data);
                    results.push({'module' : scanModule.moduleId, data});
                }
                else{
                    console.log("No data for " + scanModule.moduleName + "scan")
                }

                modulesScanned++;
                updateScanProgressBar();

                if(modulesScanned == totalModules){
                    scanCompleted(results)
                    _callback();
                }
            }).catch(err => console.log(err))
        }, this);
    
    

    }
}


updateScanProgressBar = function(){
    percent = (modulesScanned)/(totalModules).toPrecision(2) * 100;
    $(".progress-bar").width(`${percent}%`).text(percent+"%");
}

scanCompleted = function(results){
    console.log("Scan completed!")
    console.log(results);

    uiWriter.writeToScanLog("Scan completed.")

    var dir = os.homedir() + "\\WindowsDiff\\Results\\";

    mkdirp(dir, function(){
        var dateTime = moment().format("YYYYMMDD_HHmmss");
        var filename = dir+dateTime+".json";
        fs.writeFile(filename, JSON.stringify(results), function(err){ });
        uiWriter.writeToScanLog("Saved result in file : " + filename);        
    });

}






