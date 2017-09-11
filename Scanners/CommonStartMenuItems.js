const shell = require('node-powershell')
const Enumerable = require('linq');
const diffResults = require('../DiffResults');

var item = function(obj) {
    var item = {
        filename : obj.FullName,
        lastmodifieddate : obj.LastWriteTime
    };

    return item;
}

module.exports = {
    
    ScannerId : "commonstartmenu",
    ScannerName : "Common Start Menu",

    buildItem : function(obj){
        return item(obj);
    },

    scan : function(){
        let ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
          });
        
          ps.addCommand("Get-ChildItem -Path ([Environment]::GetFolderPath('CommonStartMenu')) -Recurse | Select-Object FullName, LastWriteTime | ConvertTo-Json -Compress");
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
            var beforeItem = Enumerable.from(beforeList).firstOrDefault(function(x) { return x.Name == afterItem.Name });

            if(beforeItem == null){
                results.push(diffResults.added(afterItem));
                return;
            }

        }, this);
    
        return results;        
    }

}