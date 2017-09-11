const shell = require('node-powershell')
const Enumerable = require('linq');
const diffResults = require('../DiffResults');

var item = function(obj) {
    var item = {
        id : obj.TaskPath + obj.TaskName
    };

    return item;
}

module.exports = {
    
    ScannerId : "scheduledtasks",
    ScannerName : "Scheduled Tasks",

    buildItem : function(obj){
        return item(obj);
    },

    scan : function(){
        let ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
          });
        
          ps.addCommand("Get-ScheduledTask | Get-ScheduledTaskInfo | Select TaskName, TaskPath | ConvertTo-Json -Compress");
          return ps.invoke();
    },


    diff : function(beforeList, afterList){
        
        var results = [];

        beforeList.forEach(function(beforeItem) {
            var afterItem = Enumerable.from(afterList).firstOrDefault(function(x) { return x.id == beforeItem.id });

            if(afterItem == null){
                results.push(diffResults.deleted(beforeItem));
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