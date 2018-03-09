const shell = require('node-powershell')
const Enumerable = require('linq');
const diffResults = require('../DiffResults');
const trans = require('../trans');
const fileManager = require('../FilesManager');

var item = function(obj) {
    var item = {
        id : obj.PSChildName,
        name : obj['(default)'] 
    };

    return item;
}

module.exports = {
    
    ScannerId : "activexcontrols",
    ScannerName : trans('scanners.activexcontrols'),

    buildItem : function(obj){
        return item(obj);
    },

    scan : function(){
        let ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
          });
        
          ps.addCommand("(gci Registry::HKEY_CLASSES_ROOT\\CLSID\\*\\Control).PSParentPath | Get-ItemProperty | Select '(default)',PSChildName | ConvertTo-Json -Compress | Out-File '" + fileManager.getLastScanFileName() + "' -Encoding utf8 -Force");
          return ps.invoke();
    },


    diff : function(beforeList, afterList){
        
        var results = [];

        beforeList.forEach(function(beforeItem) {
            var afterItem = Enumerable.from(afterList).firstOrDefault(function(x) { return x.id == beforeItem.id });

            if(afterItem == null){
                //Default folder doesn't exists anymore
                results.push(diffResults.deleted(beforeItem));
                return;
            }

            if(beforeItem.name != afterItem.name){
                //Default folder modified
                results.push(diffResults.modified(beforeItem, afterItem));
                return;
            }

        }, this);

        afterList.forEach(function(afterItem) {
            var beforeItem = Enumerable.from(beforeList).firstOrDefault(function(x) { return x.id == afterItem.id });

            if(beforeItem == null){
                results.push(diffResults.added(afterItem));
                return;
            }

        }, this);
    
        return results;        
    }

}