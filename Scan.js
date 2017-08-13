const modulesManager = require('./ModulesManager');
const fs = require('fs');
const mkdirp = require('mkdirp');
const moment = require('moment');
const uiWriter = require('./UIWriter');


module.exports = {
    launchScan : function(_callback){
        var results = [];

        var modulesToScan = [];
        $(".chk-module:checked").each(function() { modulesToScan.push(this.id) });
        console.log(modulesToScan)

        totalModules = modulesToScan.length;

        modulesScanned = 0;
        updateScanProgressBar();

        uiWriter.writeToScanLog("Scan started.")

        modulesManager.modules.forEach(function(element) {

            if(!modulesToScan.includes(element.moduleId)){
                return;
            }
            uiWriter.writeToScanLog("Starting scan for : " + element.moduleName + ".");
            element.scan().then(function(data){
                if(data){                    
                    data = JSON.parse(data);
                    uiWriter.writeToScanLog("Scan completed for : " + element.moduleName + "finished. Found " + data.length + " elements.");
                    console.log(data);
                    results.push({'module' : element.moduleId, data});
                }
                else{
                    console.log("No data for " + element.moduleName + "scan")
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
   
    mkdirp("C:\\Temp\\WindowsDiff\\Results\\", function(){
        var dateTime = moment().format("YYYYMMDD_HHmmss");
        fs.writeFile("C:\\Temp\\WindowsDiff\\Results\\"+dateTime+".json", JSON.stringify(results), function(err){ });
        uiWriter.writeToScanLog("Saved result in file : C:\\Temp\\WindowsDiff\\Results\\"+dateTime+".json")
    });



}






