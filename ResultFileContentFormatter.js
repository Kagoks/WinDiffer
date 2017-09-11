const StringBuilder = require('stringbuilder');

module.exports = {

    format : function(content){

        return new Promise(function(resolve, reject){

            var data = JSON.parse(content);

            var sb = new StringBuilder({ newLine:'\r\n' });
            
            data.forEach(function(diff){
                sb.appendLine("[" + diff.scanner + "]");
                
                if(diff.results.length == 0){
                    sb.appendLine("-- No change --");
                }
                else {
                    diff.results.forEach(function(result){
                        if(result.diffType == "Added"){
                            sb.appendLine("Added : " + JSON.stringify(result.newItem).replace(/\\\\/g, '\\'));
                        }
                        else if(result.diffType == "Deleted"){
                            sb.appendLine("Deleted : " + JSON.stringify(result.oldItem).replace(/\\\\/g, '\\'));
                        }
                        else if(result.diffType == "Modified"){
                            sb.appendLine("Modified (before) : " + JSON.stringify(result.oldItem).replace(/\\\\/g, '\\',));
                            sb.appendLine("Modified (after)  : " + JSON.stringify(result.newItem).replace(/\\\\/g, '\\'));
                        }
                    });
                }
    
                sb.appendLine();
                
            });
    
            sb.build(function(err, result){
                resolve(result);
            });
            
        });


    }


}