const fs = require("fs");

var strings = JSON.parse(fs.readFileSync("./strings.json"));
var config = JSON.parse(fs.readFileSync("./config.json"));



module.exports = function(str){
        var obj = str.split('.');
        var item = {};

        item = strings[config['lang']];
        console.log(item);

        for(var x=0; x<obj.length; x++){
            item = item[obj[x]];
            console.log(item);
        }
        console.log(item);
        return item;
    }




