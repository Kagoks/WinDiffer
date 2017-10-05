const shell = require('node-powershell')
const Enumerable = require('linq');
const diffResults = require('../DiffResults');
const trans = require('../trans');
const fileManager = require('../FilesManager');
const moment = require('moment');

var item = function(obj) {
    var item = {
        filename : obj.FullName,
        lastmodifieddate : moment(obj.LastWriteTime).format("YYYY-MM-DD HH:mm:ss")
    };

    return item;
}

module.exports = {
    
    ScannerId : "commonstartmenu",
    ScannerName : trans('scanners.commonstartmenu'),

    buildItem : function(obj){
        return item(obj);
    },

    scan : function(){
        let ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
          });
        
          ps.addCommand("Get-ChildItem -Path ([Environment]::GetFolderPath('CommonStartMenu')) -Recurse | Select-Object FullName, LastWriteTime | ConvertTo-Json -Compress | Out-File '" + fileManager.getLastScanFileName() + "' -Encoding utf8 -Force");
          return ps.invoke();
    },


    diff : function(beforeList, afterList){
        
        var results = [];

        beforeList.forEach(function(beforeItem) {
            var afterItem = Enumerable.from(afterList).firstOrDefault(function(x) { return x.filename == beforeItem.filename });

            if(afterItem == null){
                //Service doesn't exists anymore
                results.push(diffResults.deleted(beforeItem));
                return;
            }

            if(beforeItem.lastmodifieddate != afterItem.lastmodifieddate){
                //Service modified
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