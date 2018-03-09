const fs = require("fs");
const path = require('path');

var strings = JSON.parse(fs.readFileSync(path.join(__dirname, "strings.json")));
var config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json")));



module.exports = function(str){
        var obj = str.split('.');
        var item = {};

        item = strings[config['lang']];

        for(var x=0; x<obj.length; x++){
            item = item[obj[x]];
        }
        return item;
    }




