const scannersManager = require('./ScannersManager');
const scan = require('./Scan');
const compare = require('./Compare');
const fs = require('fs');
const filesManager = require('./FilesManager');
const resultFileContentFormatter = require('./ResultFileContentFormatter');

module.exports = {

    scanRunning : false,
    compareRunning : false,
    snapshotFileLoading : false,

    scanners : scannersManager.scanners,

    beforeSnapshotData : [],
    afterSnapshotData : [],


    startScan : function(scannersIds){
        return scan.launchScan(getScannersFromIds(scannersIds));
    },

    startCompare : function(){
        return compare.start(this.beforeSnapshotData, this.afterSnapshotData, this.scanners);
    },

    getSnapshotsFiles : function(){
        return filesManager.getSnapshotsFiles();
    },

    getSnapshotFileContent : function(file){
        return filesManager.getSnapshotFileContent(file);
    },

    getResultsFiles : function(){
        return filesManager.getResultsFiles();
    },

    getFormattedResultFileContent : function(file){

        return filesManager.getResultsFileContent(file).then(function(content){
            return resultFileContentFormatter.format(content);
        });        
    }



}


var getScannerById = function(scannerId){

    var data = {};

    module.exports.scanners.forEach(function(scanner){
        if(scanner.ScannerId == scannerId){            
            data = scanner;
            return;
        }
    });

    return data;
}


var getScannersFromIds = function(scannersIds){

    var scanners = []

    scannersIds.forEach(function(scannerId) {
        scanners.push(getScannerById(scannerId));        
    }, this);

    return scanners;
}





