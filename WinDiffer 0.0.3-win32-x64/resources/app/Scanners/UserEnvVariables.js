const shell = require('node-powershell')
const Enumerable = require('linq');
const diffResults = require('../DiffResults');
const trans = require('../trans');
const fileManager = require('../FilesManager');

var item = function(obj) {
    var item = {
        key : obj.Key,
        value : obj.Value
    };

    return item;
}

module.exports = {
    
    ScannerId : "userenvvariables",
    ScannerName : trans('scanners.userenvvariables'),

    buildItem : function(obj){
        return item(obj);
    },

    scan : function(){
        let ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
          });
        
          ps.addCommand("[Environment]::GetEnvironmentVariables('User').GetEnumerator() | Select Key,Value | ConvertTo-Json | Out-File \"" + fileManager.getLastScanFileName() + "\" -Encoding utf8 -Force");
          return ps.invoke();
    },


    diff : function(beforeList, afterList){
        
        var results = [];

        beforeList.forEach(function(beforeItem) {
            var afterItem = Enumerable.from(afterList).firstOrDefault(function(x) { return x.key == beforeItem.key });

            if(afterItem == null){
                //Service doesn't exists anymore
                results.push(diffResults.deleted(beforeItem));
                return;
            }

             if(beforeItem.value != afterItem.value){
                //Service modified
                results.push(diffResults.modified(beforeItem, afterItem));
                return;
            }


        }, this);

        afterList.forEach(function(afterItem) {
            var beforeItem = Enumerable.from(beforeList).firstOrDefault(function(x) { return x.key == afterItem.key });

            if(beforeItem == null){
                results.push(diffResults.added(afterItem));
                return;
            }

        }, this);
    
        return results;        
    }

}