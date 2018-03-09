const StringBuilder = require('stringbuilder');
const trans = require('./trans');

module.exports = {

    format : function(content){

        return new Promise(function(resolve, reject){

            var data = JSON.parse(content);

            var sb = new StringBuilder({ newLine:'\r\n' });

            sb.appendLine("[WinDiffer v.0.0.3]");
            sb.appendLine();

            data.forEach(function(diff){
                sb.appendLine("[" + diff.scanner + "]");
                
                if(diff.results.length == 0){
                    sb.appendLine("-- " + trans('results.nochange') + "--");
                }
                else {

                    sb.appendLine("<table style=\"border:1px solid black\">")
                    sb.appendLine("<tr>")
                    sb.appendLine("<th width=\"110\">Diff</th>")   

                    var baseItem;
                    if(diff.results[0].oldItem != null){
                        baseItem = diff.results[0].oldItem;
                    }
                    else
                    {
                        baseItem = diff.results[0].newItem;
                    }
                    
                    console.log(baseItem);              

                    for (var property in baseItem) {      
                        if (diff.results[0].oldItem.hasOwnProperty(property)) {
                            sb.appendLine("<th>" + property + "</th>")  
                        }
                    }

                    sb.appendLine("</tr>")

                    diff.results.forEach(function(result){
 

                        if(result.diffType == "Added"){
                            sb.appendLine("<tr style=\"border-top:2px solid black;\">");
                            sb.appendLine("<td>" + trans('results.added') + "</td>");
                            
                            for (var property in result.newItem) {      
                                sb.appendLine("<td>" + result.newItem[property] + "</td>")                                 
                            }
                            sb.appendLine("</tr>");
                           // sb.appendLine(trans('results.added')  + " : " + JSON.stringify(result.newItem).replace(/\\\\/g, '\\')) ;
                            
                        }
                        else if(result.diffType == "Deleted"){
                            sb.appendLine("<tr style=\"border-top:2px solid black;\">");
                            sb.appendLine("<td>" + trans('results.deleted') + "</td>");
                            
                            for (var property in result.oldItem) {      
                                sb.appendLine("<td>" + result.oldItem[property] + "</td>")                                 
                            }
                            sb.appendLine("</tr>");
                            //sb.appendLine(trans('results.deleted') + " : " + JSON.stringify(result.oldItem).replace(/\\\\/g, '\\'));
                        }
                        else if(result.diffType == "Modified"){

                            sb.appendLine("<tr style=\"border-top:2px solid black;\">");
                            sb.appendLine("<td>" + trans('results.modifiedbefore') + "</td>");
                            
                            for (var property in result.oldItem) {      
                                sb.appendLine("<td>" + result.oldItem[property] + "</td>")                                 
                            }
                            sb.appendLine("</tr>");

                            sb.appendLine("<tr style=\"border-bottom:2px solid black\">");
                            sb.appendLine("<td>" + trans('results.modifiedafter') + "</td>");
                            
                            for (var property in result.newItem) {      
                                sb.appendLine("<td>" + result.newItem[property] + "</td>")                                 
                            }
                            sb.appendLine("</tr>");
                            //sb.appendLine(trans('results.modifiedbefore') + " : " + JSON.stringify(result.oldItem).replace(/\\\\/g, '\\',));
                            //sb.appendLine(trans('results.modifiedafter') + " : " + JSON.stringify(result.newItem).replace(/\\\\/g, '\\'));
                        }

                    });

                    sb.appendLine("</table>")
                }
    
                sb.appendLine();
                
            });
    
            sb.build(function(err, result){
                resolve(result);
            });
            
        });


    }


}