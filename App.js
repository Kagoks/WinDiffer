const modulesManager = require('./ModulesManager');
const scan = require('./Scan');
const notifier = require('node-notifier');
const fs = require('fs');
const os = require('os');
const compare = require('./Compare');

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
            //addToFirst = false; //This will force modules to span over to the second column
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
    resetScanLogs();
    $(this).prop('disabled', true).text('Scan running, please wait...');    
    scan.launchScan(function(){
        
        notifier.notify({
            message : "Scan completed!"
        });
        setTimeout(function(){
            $("#btnStartScan").prop('disabled', false).text('Start Scan');  
            resetScanProgress();
        }, 1500)
    });
});


$("#check-all-modules").change(function(){
    $(".chk-module").prop('checked', $(this).prop('checked'));
});


var resetScanProgress = function(){
    $(".progress-bar").width("0%").text("0%");
} 

var resetScanLogs = function(){
    $(".scan-logs").text("");
}


$('a#nav-compare-tab').click(function (e) {

    if($(this).hasClass('active')){
        return;
    }

    fs.readdir(os.homedir() + "\\WindowsDiff\\Results", (err, files) => {
        
        if(files.length < 2){
            return;
        }

        files.reverse().forEach(file => {
            compare.appendToCombobox(file);
        });

        $('#cboBefore option:eq(1)').attr('selected', 'selected');
        $('#cboAfter option:eq(0)').attr('selected', 'selected');

        compare.loadBeforeCompareFile();
        compare.loadAfterCompareFile();
    });   

    e.preventDefault()
    compare.reset();
   
    
  });

  $('#cboBefore').change(function(){
    compare.loadBeforeCompareFile();
  });

  $('#cboAfter').change(function(){
    compare.loadAfterCompareFile();
  });


  $("#btnStartCompare").click(function(){
    $(this).prop('disabled', true).text('Compare running, please wait...');
    compare.startCompare();
    $(this).prop('disabled', false).text('Start compare');
  });



