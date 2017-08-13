const shell = require('node-powershell');
const linq = require('linq');

module.exports = {
    
    moduleId : "services",
    moduleName : "Services",

    item : function() {
        id, name, version
    },

    scan : function(){
        let ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
          });

          ps.addCommand("Get-Service | Select -property Name,DisplayName,StartType,Status | ConvertTo-Json -Compress");
          return ps.invoke();
    },


    diff : function(beforeList, afterList){

        var results = [];

        beforeList.forEach(function(beforeItem) {
            var afterItem = Enumerable.from(afterItems).firstOrDefault(function(x) { return x.Name == beforeItem.Name });

            if(afterItem != null){
                //Service doesn't exists anymore
                //ToDo: Push DiffResults
            }

            if(beforeItem.DisplayName != afterItem.DisplayName || beforeItem.StartType != afterItem.StartType || beforeItem.Status != afterItem.Status){
                //Service modified
                //ToDo: Push DiffResults
            }

        }, this);

        afterList.forEach(function(afterItem) {
            var beforeItem = Enumerable.from(beforeList).firstOrDefault(function(x) { return x.Name == afterItem.Name });

            if(beforeItem == null){
                //Service is new, didn't exists before
                //ToDo: Push DiffResults
            }

        }, this);
    
        return results;        
    }

}