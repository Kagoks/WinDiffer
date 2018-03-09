const shell = require('node-powershell')
const Enumerable = require('linq');
const diffResults = require('../DiffResults');
const trans = require('../trans');
const fileManager = require('../FilesManager');


var item = function(obj) {
    var item = {
        name : obj.Name
    };

    return item;
}

module.exports = {
    
    ScannerId : "printers",
    ScannerName : trans('scanners.printers'),

    buildItem : function(obj){
        return item(obj);
    },

    scan : function(){
        let ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
          });
        
          ps.addCommand("Get-WmiObject Win32_Printer | Select Name | ConvertTo-Json -Compress | Out-File '" + fileManager.getLastScanFileName() + "' -Encoding utf8 -Force");
          return ps.invoke();
    },


    diff : function(beforeList, afterList){
        
        var results = [];

        beforeList.forEach(function(beforeItem) {
            var afterItem = Enumerable.from(afterList).firstOrDefault(function(x) { return x.name == beforeItem.name });

            if(afterItem == null){
                //Service doesn't exists anymore
                results.push(diffResults.deleted(beforeItem));
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