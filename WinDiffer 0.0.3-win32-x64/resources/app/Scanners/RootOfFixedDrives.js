const shell = require('node-powershell')
const Enumerable = require('linq');
const diffResults = require('../DiffResults');
const trans = require('../trans');
const fileManager = require('../FilesManager');
const moment = require('moment');

var item = function(obj) {
    var item = {
        filename : obj.FullName,
        LastWriteTime : moment(obj.LastWriteTime).format("YYYY-MM-DD HH:mm:ss") 
    };

    return item;
}

module.exports = {
    
    ScannerId : "rootfixeddrives",
    ScannerName : trans('scanners.rootfixeddrives'),

    buildItem : function(obj){
        return item(obj);
    },

    scan : function(){
        let ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
          });
        
          ps.addCommand("gci -Path ([System.IO.DriveInfo]::getdrives() | Where-Object DriveType -eq 'Fixed').Name | Select LastWriteTime, FullName | ConvertTo-Json -Compress | Out-File '" + fileManager.getLastScanFileName() + "' -Encoding utf8 -Force");
          return ps.invoke();
    },


    diff : function(beforeList, afterList){
        
        var results = [];

        beforeList.forEach(function(beforeItem) {
            var afterItem = Enumerable.from(afterList).firstOrDefault(function(x) { return x.filename == beforeItem.filename });

            if(afterItem == null){
                //Default folder doesn't exists anymore
                results.push(diffResults.deleted(beforeItem));
                return;
            }

            if(beforeItem.lastWriteTime != afterItem.lastWriteTime){
                //Default folder modified
                results.push(diffResults.modified(beforeItem, afterItem));
                return;
            }

        }, this);

        afterList.forEach(function(afterItem) {
            var beforeItem = Enumerable.from(beforeList).firstOrDefault(function(x) { return x.filename == afterItem.filename });

            if(beforeItem == null){
                results.push(diffResults.added(afterItem));
                return;
            }

        }, this);
    
        return results;        
    }

}