const controller = require('./Controller');
const uiWriter = require('./UIWriter');
const notifier = require('node-notifier');

module.exports = {
    init : function(){
        loadScanTab()
    }
}

$('a#nav-scan-tab').click(function(e){
    loadScanTab();
});

$('a#nav-compare-tab').click(function(){
    loadCompareTab();
});

    
$('a#nav-results-tab').click(function(){
    loadResultsTab();       
});

$('#btnCopyResult').click(function(){

    window.getSelection().removeAllRanges();
    var range = document.createRange();
    
    range.selectNode(document.getElementById("compareResults"));
    window.getSelection().addRange(range);

    document.execCommand("Copy");
    notifier.notify({
        title : "WinDiffer",
        message : "Résultat copié au presse-papiers"
    });

    
});
        



var loadScanTab = function(){

    $scannersFirstCol = []
    $scannersSecondCol = []

    for($x=0; $x<controller.scanners.length; $x++){
        if($x % 2 == 0){
            $scannersFirstCol.push(controller.scanners[$x]);
        }
        else{
            $scannersSecondCol.push(controller.scanners[$x]);
        }

    }
    

    $.get('./templates/scanners.hds', function(template){
        var template = Handlebars.compile(template);        
        $('.checkboxes.first').html(template($scannersFirstCol));
        $('.checkboxes.second').html(template($scannersSecondCol));
    });

    $('a#nav-scan-tab').tab('show');
}



$("#btnStartScan").click(function(){

    controller.scanRunning = true;

    $(this).prop('disabled', true).text(trans('scan.scanrunning'));  
    $(".loading.loading-scan").show();

    
    var scannersIds = $('.chk-module:checked').map(function(){ return this.id }).get();
    controller.startScan(scannersIds).then(function(){
        notifier.notify({
            title : "WinDiffer",
            message : "Scan completed!"
        });

        setTimeout(function(){
            $("#btnStartScan").prop('disabled', false).text(trans("scan.startscan"));
            controller.scanRunning = false;
            $(".loading.loading-scan").hide();
        }, 1500);

    });

});


$("#check-all-modules").change(function(){
    $(".chk-module").prop('checked', $(this).prop('checked'));
});


$('#cboBefore').change(function(){
loadBeforeSnapshopFile();
});

$('#cboAfter').change(function(){
loadAfterSnapshotFile();
});


  $("#btnStartCompare").click(function(){

    controller.compareRunning = true;
    $(".loading.loading-compare").show();

    $(this).prop('disabled', true).text(trans('compare.comparerunning'));
    controller.startCompare().then(function(){

        setTimeout(function(){
            $("#btnStartCompare").prop('disabled', false).text(trans('compare.startcompare'));
            controller.compareRunning = false;
            $(".loading.loading-compare").hide();
            loadResultsTab();
        }, 1500);
    });   

   
    
  });

  var loadCompareTab = function(){

    
    $('#cboBefore').html("<option>Loading, please wait...</option>");
    $('#cboAfter').html("<option>Loading, please wait...</option>");

    $('a#nav-compare-tab').tab('show');



    controller.getSnapshotsFiles().then(function(files){

        $('#cboBefore').html("");
        $('#cboAfter').html("");

        files.forEach(function(file) {
            $('#cboBefore').append(`<option value="${file}">${file}</option>`)
            $('#cboAfter').append(`<option value="${file}">${file}</option>`)
        });

        $('#cboBefore option:eq(1)').attr('selected', 'selected');
        $('#cboAfter option:eq(0)').attr('selected', 'selected');

        loadBeforeSnapshopFile();
        loadAfterSnapshotFile();

    });
  }


var loadBeforeSnapshopFile = function(){
    var file = $('#cboBefore').val();

    $('#scanResultsBefore').fadeOut('fast', function(){
        $(this).html('Loading, please wait...').fadeIn('fast', function(){
            controller.getSnapshotFileContent(file).then(function(content){
                return new Promise(function(resolve, reject){
                    var jsonContent = JSON.parse(content);
                    controller.beforeSnapshotData = jsonContent;
                    var formattedData = jsonPrettyPrint.toHtml(jsonContent);           
                    resolve(formattedData);
                });
            }).then(function(formattedData){
                $('#scanResultsBefore').fadeOut('fast', function(){
                    $(this).html("<pre>" + formattedData + "</pre>").fadeIn('fast');
                });
                
            });
        });
    }); 
}


var loadAfterSnapshotFile = function(){
    var file = $('#cboAfter').val();


    $('#scanResultsAfter').fadeOut('fast', function(){
        $(this).html('Loading, please wait...').fadeIn('fast', function(){
            controller.getSnapshotFileContent(file).then(function(content){                
                return new Promise(function(resolve, reject){
                    var jsonContent = JSON.parse(content);
                    controller.afterSnapshotData = jsonContent;
                    var formattedData = jsonPrettyPrint.toHtml(jsonContent);           
                    resolve(formattedData);
                });
            }).then(function(formattedData){
                $('#scanResultsAfter').fadeOut('fast', function(){
                    $(this).html("<pre>" + formattedData + "</pre>").fadeIn('fast');
                });                
            });
        });
    }); 
}




  var loadResultsTab = function(){
    $('a#nav-results-tab').tab('show');

    controller.getResultsFiles().then(function(files){
        
        $('#cboCompare').html("");

        files.forEach(function(file) {
            $('#cboCompare').append(`<option value="${file}">${file}</option>`)
        });

        loadResultFile();
    });
  }



  var loadResultFile = function(file){

    var file = $('#cboCompare').val();

    $("#compareResults").fadeOut('fast', function(){
        $("#compareResults").html("Loading file...").show();
        controller.getFormattedResultFileContent(file).then(function(content){
            $("#compareResults").html("<pre>" + content + "</pre>").fadeIn('slow');
        });                   
    }); 
}



  
$('a#nav-results-tab').click(function (e) {
    
    loadResultsTab();


    if($(this).hasClass('active')){
        return;
    }
    
    results.loadResultsTab();
    
});

$('#cboCompare').change(function(){
    loadResultFile();
  });


    



  var jsonPrettyPrint = {
    replacer: function(match, pIndent, pKey, pVal, pEnd) {
       var key = '<span class=json-key>';
       var val = '<span class=json-value>';
       var str = '<span class=json-string>';
       var r = pIndent || '';
       if (pKey)
          r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
       if (pVal)
          r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
       return r + (pEnd || '');
       },
    toHtml: function(obj) {
       var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
       var data = JSON.stringify(obj, null, 2)
          .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
          .replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(jsonLine, jsonPrettyPrint.replacer);

          return data;
       }
    };
 