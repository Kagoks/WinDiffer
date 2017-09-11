const os = require('os');
const fs = require('fs');


var snapshotsFilesDir = os.homedir() + "\\WinDiffer\\Snapshots";
var resultsFilesDir = os.homedir() + "\\WinDiffer\\Results";



module.exports = {
    

    getSnapshotsFiles : function(){
        var snapshotsFiles = [];    
    
        return new Promise(function(resolve, reject){
            fs.readdir(snapshotsFilesDir, function(err, files) {      
    
                files.reverse().forEach(file => {
                    snapshotsFiles.push(file);
                });
    
                resolve(snapshotsFiles);
            });
    
        });
    },



    getSnapshotFileContent : function(file){

        return new Promise(function(resolve, reject){
                    
            fs.readFile(snapshotsFilesDir + "\\" + file, 'utf8', function(err, content){
                resolve(content);
            });  
        });
    },



    getResultsFiles : function(){
        var resultsFiles = [];    
    
        return new Promise(function(resolve, reject){
            fs.readdir(resultsFilesDir, function(err, files) {      
    
                files.reverse().forEach(file => {
                    resultsFiles.push(file);
                });
    
                resolve(resultsFiles);
            });
    
        });
    },

    getResultsFileContent : function(file){
        return new Promise(function(resolve, reject){
            
            fs.readFile(resultsFilesDir + "\\" + file, 'utf8', function(err, content){
                resolve(content);
            });  
        });
    },


}


