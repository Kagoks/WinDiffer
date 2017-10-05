const fs = require('fs');
const os = require('os');
const StringBuilder = require('stringbuilder');

module.exports = {

    loadResultsFile : function(){
        loadResultsFile();
    },


    loadResultsTab : function(){
        fs.readdir(os.homedir() + "\\WinDiffer\\Compare", function(err, files) {
                        
            if(files.length == 0){
                return;
            }
    
            files.reverse().forEach(file => {
                appendToCombobox(file);
            });
    
            $('#cboBefore option:eq(1)').attr('selected', 'selected');
            $('#cboAfter option:eq(0)').attr('selected', 'selected');
    
            loadResultsFile();
        }); 
    }
}


var appendToCombobox =  function(file){
    $('#cboCompare').append(`<option value="${file}">${file}</option>`)
}

var loadResultsFile = function(){
    $("#compareResults").fadeOut('fast', function(){
        $("#compareResults").html("Loading file...").show();
        getResultsFileContent(function(data){

            
            sb = formatDiff(JSON.parse(data));    
            sb.build(function(err, result){
                $("#compareResults").html("<pre>" + result + "</pre>").fadeIn('slow');      
            });
                
        });            
    }); 
}


var getResultsFileContent = function(_callback){
    var file = os.homedir() + "\\WinDiffer\\Compare\\" + $('#cboCompare').val();
    
    var content = '';

    fs.readFile(file, 'utf8', function(err, data){;
        _callback(data);
    });    
}



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
    toHtml: function(obj, _callback) {
       var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
       var data = JSON.stringify(obj, null, 3)
          .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
          .replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(jsonLine, jsonPrettyPrint.replacer);

          _callback(data);
       }
    };


    var formatDiff = function(data){

        var sb = new StringBuilder({ newLine:'\r\n' });


            sb.appendLine("[WinDiffer Version 0.01]");
        

        data.forEach(function(diff){
            sb.appendLine("[" + diff.module + "]");
            
            if(diff.results.length == 0){
                sb.appendLine("-- No change --");
            }
            else {
                diff.results.forEach(function(result){
                    if(result.diffType == "Added"){
                        sb.appendLine("Added : " + JSON.stringify(result.newItem));
                    }
                    else if(result.diffType == "Deleted"){
                        sb.appendLine("Deleted : " + JSON.stringify(result.oldItem));
                    }
                    else if(result.diffType == "Modified"){
                        sb.appendLine("Modified (before) : " + JSON.stringify(result.oldItem));
                        sb.appendLine("Modified (after)  : " + JSON.stringify(result.newItem));
                    }
                });
            }

            sb.appendLine();
            
        });


        return sb;
    }
