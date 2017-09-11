const shell = require('node-powershell')
const Enumerable = require('linq');
const diffResults = require('../DiffResults');

var item = function(obj) {
    var item = {
        id : obj.PSChildName,
        displayName : obj.DisplayName,
        displayVersion :  obj.DisplayVersion
    };

    return item;
}

module.exports = {
    
    ScannerId : "installedprograms64",
    ScannerName : "Installed programs - 64 bits",

    buildItem : function(obj){
        return item(obj);
    },

    scan : function(){
        let ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
          });
        
          ps.addCommand("Get-ChildItem -Path HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | ForEach-Object { Get-ItemProperty $_.pspath } | Select-Object PSChildName, DisplayName, DisplayVersion | ConvertTo-Json -Compress");
          return ps.invoke();
    },


    diff : function(beforeList, afterList){
        
        var results = [];

        beforeList.forEach(function(beforeItem) {
            var afterItem = Enumerable.from(afterList).firstOrDefault(function(x) { return x.id == beforeItem.id });

            if(afterItem == null){
                //Service doesn't exists anymore
                results.push(diffResults.deleted(beforeItem));
                return;
            }

            if(beforeItem.displayName != afterItem.displayName || beforeItem.displayVersion != afterItem.displayVersion){
                //Service modified
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