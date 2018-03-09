module.exports = {

    writeToScanLog : function(data){
        var logs = $(".scan-logs");
        if(logs.text().length > 0)
            logs.append("<br />" + data);
        else
            logs.append(data);

        logs.scrollTop(logs[0].scrollHeight);
    },
    
    resetScanLogs : function(){
        $(".scan-logs").text("");
    },





}


