const shell = require('node-powershell');
const Enumerable = require('linq');
const diffResults = require('../DiffResults');


var item = function(obj) {
    var item = {
        name : obj.Name,
        displayName : obj.DisplayName,
        startType :  getStartType(obj.StartType), 
        status : getStatus(obj.Status)
    };

    return item;
}

module.exports = {
    
    moduleId : "services",
    moduleName : "Services",

    buildItem : function(obj){
        return item(obj);
    },

    scan : function(){
        let ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true,
            outputEncoding: 'utf8'
          });

          ps.addCommand("Get-Service | Select -property Name,DisplayName,StartType,Status | ConvertTo-Json -Compress");
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

            if(beforeItem.displayName != afterItem.displayName || beforeItem.startType != afterItem.startType || beforeItem.status != afterItem.status){
                //Service modified
                results.push(diffResults.modified(beforeItem, afterItem));
                return;
            }

        }, this);

        afterList.forEach(function(afterItem) {
            var beforeItem = Enumerable.from(beforeList).firstOrDefault(function(x) { return x.name == afterItem.name });

            if(beforeItem == null){
                //Service is new, didn't exists before
                results.push(diffResults.added(afterItem));
                return;
            }

        }, this);
    
        return results;        
    }

}


var getStatus = function(status){
    switch(status){
        case 1:
            return 'Stopped';
        case 4 :
            return 'Running';
        default :
            return 'Unknown';        
    }
}


var getStartType = function(startType){
    switch(startType){
        case 2:
            return 'Automatic';
        case 3:
            return 'Manual';
        case 4 :
            return 'Disabled';
        default :
            return 'Unknown';        
    }
}