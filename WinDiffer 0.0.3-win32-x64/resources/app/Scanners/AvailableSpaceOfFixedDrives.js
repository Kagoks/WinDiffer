const shell = require('node-powershell')
const Enumerable = require('linq');
const diffResults = require('../DiffResults');
const trans = require('../trans');
const fileManager = require('../FilesManager');

var item = function(obj) {
    var item = {
        name : obj.Name,
        availableFreeSpace : (obj.AvailableFreeSpace / 1024 / 1024).toFixed(2) + " Mb" 
    };

    return item;
}

module.exports = {
    
    ScannerId : "availablespacefixeddrives",
    ScannerName : trans('scanners.availablespacefixeddrives'),

    buildItem : function(obj){
        return item(obj);
    },

    scan : function(){
        let ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
          });
        
          ps.addCommand("[System.IO.DriveInfo]::getdrives() | Where-Object DriveType -eq 'Fixed' | Select Name,AvailableFreeSpace | ConvertTo-Json -Compress | Out-File '" + fileManager.getLastScanFileName() + "' -Encoding utf8 -Force");
          return ps.invoke();
    },


    diff : function(beforeList, afterList){
        
        var results = [];

        beforeList.forEach(function(beforeItem) {
            var afterItem = Enumerable.from(afterList).firstOrDefault(function(x) { return x.name == beforeItem.name });

            if(afterItem == null){
                //Default folder doesn't exists anymore
                results.push(diffResults.deleted(beforeItem));
                return;
            }

            if(beforeItem.availableFreeSpace != afterItem.availableFreeSpace){
                //Default folder modified
                results.push(diffResults.modified(beforeItem, afterItem));
                return;
            }

        }, this);

        afterList.forEach(function(afterItem) {
            var beforeItem = Enumerable.from(beforeList).firstOrDefault(function(x) { return x.name == afterItem.name });

            if(beforeItem == null){
                results.push(diffResults.added(afterItem));
                return;
            }

        }, this);
    
        return results;        
    }

}