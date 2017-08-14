const modulesManager = require('./ModulesManager');
const fs = require('fs');
const mkdirp = require('mkdirp');
const moment = require('moment');
const uiWriter = require('./UIWriter');
const os = require('os');
var beautify = require("json-beautify");


module.exports = {
    appendToCombobox : function(file){
        $('#cboBefore').append(`<option value="${file}">${file}</option>`)
        $('#cboAfter').append(`<option value="${file}">${file}</option>`)
    },

    reset : function(){
        $('#cboBefore').html("");
        $('#cboAfter').html("");
    },

    loadBeforeCompareFile : function(){

        $("#scanResultsBefore").fadeOut('fast', function(){
            $("#scanResultsBefore").html("Loading file...").show();
            getBeforeFileContent(function(data){
                data = jsonPrettyPrint.toHtml(JSON.parse(data), function(niceData){
                    $("#scanResultsBefore").html("<pre>" + niceData + "</pre>").fadeIn('slow');                      
                });    
            });            
        });

        

    },

    loadAfterCompareFile : function(){

        $("#scanResultsAfter").fadeOut('fast', function(){
            $("#scanResultsAfter").html("Loading file...").show();
            getBeforeFileContent(function(data){
                data = jsonPrettyPrint.toHtml(JSON.parse(data), function(niceData){
                    $("#scanResultsAfter").html("<pre>" + niceData + "</pre>").fadeIn('slow');                      
                });    
            });            
        });

        
    },


    startCompare : function(){
        compare();
    }
   
}


var getBeforeFileContent = function(_callback){
    var file = os.homedir() + "\\WindowsDiff\\Results\\" + $('#cboBefore').val();
    
    var content = '';

    fs.readFile(file, 'utf8', function(err, data){;
        _callback(data);
    });    
}

var getAfterFileContent = function(_callback){
    var file = os.homedir() + "\\WindowsDiff\\Results\\" + $('#cboAfter').val();
    
    var content = '';

    fs.readFile(file, 'utf8', function(err, data){
        _callback(data);
    });    
}



var compare = function(){

    var beforeContent;
    var afterContent;

    var filesremaining = 2;

    var diffResults;

    getAfterFileContent(function(data){
        afterContent = data;
        filesremaining--;

        if(filesremaining == 0){
            diffResults = compareFileData(beforeContent, afterContent);
        }
    }); 

    getBeforeFileContent(function(data){
        beforeContent = data;
        filesremaining--;

        if(filesremaining == 0){
            diffResults = compareFileData(beforeContent, afterContent);
        }


        console.log(diffResults);
    }); 



}


var compareFileData = function(beforeContent, afterContent){

    var beforeAllData = JSON.parse(beforeContent); 
    var afterAllData = JSON.parse(afterContent); 

    beforeData = {};
    afterData = {};

    var diffs = [];

    beforeAllData.forEach(function(before){
        var currentModule = null;
        beforeData = before.data;
        afterData = null;

        modulesManager.modules.forEach(function(element) {
            if(before.module == element.moduleId){
                currentModule = element;
                console.log("Module " + currentModule.moduleName + " found !");                
                return;
            }    
        }, this);

        afterAllData.forEach(function(after){
            if(after.module == before.module){
                //Meme module
                afterData = after.data;
                console.log("AfterData found !")
                return;
            }
        });


        if(currentModule != null && afterData != null){
            var diff = currentModule.diff(beforeData, afterData);
            diffs.push({ module : currentModule.moduleId, results : diff });
        }
       

    })

    return diffs;

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
 








