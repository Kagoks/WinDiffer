const StringBuilder = require('stringbuilder');
const trans = require('./trans');

module.exports = {

    format : function(content){

        return new Promise(function(resolve, reject){

            var data = JSON.parse(content);

            var sb = new StringBuilder({ newLine:'\r\n' });

            sb.appendLine("[WinDiffer v.0.0.2]");
            sb.appendLine();

            data.forEach(function(diff){
                sb.appendLine("[" + diff.scanner + "]");
                
                if(diff.results.length == 0){
                    sb.appendLine("-- " + trans('results.nochange') + "--");
                }
                else {
                    diff.results.forEach(function(result){
                        if(result.diffType == "Added"){
                            sb.appendLine(trans('results.added')  + " : " + JSON.stringify(result.newItem).replace(/\\\\/g, '\\')) ;
                        }
                        else if(result.diffType == "Deleted"){
                            sb.appendLine(trans('results.deleted') + " : " + JSON.stringify(result.oldItem).replace(/\\\\/g, '\\'));
                        }
                        else if(result.diffType == "Modified"){
                            sb.appendLine(trans('results.modifiedbefore') + " : " + JSON.stringify(result.oldItem).replace(/\\\\/g, '\\',));
                            sb.appendLine(trans('results.modifiedafter') + " : " + JSON.stringify(result.newItem).replace(/\\\\/g, '\\'));
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