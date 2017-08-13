modulesManager = require('./ModulesManager');
scan = require('./Scan');

module.exports = {
    init : function(){
        loadModules();
    }
}


var loadModules = function(){

    var addToFirst = true;

    modulesManager.modules.forEach(function(element) {
        var div = ''
        if(addToFirst){
            var div = '.checkboxes.first';
            addToFirst = false;
        }
        else {
            var div = '.checkboxes.second';
            addToFirst = true;
        }

                
        $(div).append(`<div class="form-check">
                                    <label class="form-check-label">
                                        <input type="checkbox" class="chk-module" id="${element.moduleId}">
                                        ${element.moduleName}
                                    </label>
                                 </div>`)

    }, this);
  
}


$("#btnStartScan").click(function(){
    $(this).prop('disabled', true).text('Scan running, please wait...');    
    scan.launchScan(function(){
        $("#btnStartScan").prop('disabled', false).text('Start Scan');  
    });
});








