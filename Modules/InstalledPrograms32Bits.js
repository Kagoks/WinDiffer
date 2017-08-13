const shell = require('node-powershell')

module.exports = {
    
    moduleId : "installedprograms32",
    moduleName : "Installed programs - 32 bits",

    item : function() {
        id, name, version
    },

    scan : function(){
        let ps = new shell({
            executionPolicy: 'Bypass',
            noProfile: true
          });

          ps.addCommand("Get-ChildItem -Path HKLM:\\Software\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\* | ForEach-Object { Get-ItemProperty $_.pspath } | Select-Object PSChildName, DisplayName, DisplayVersion | ConvertTo-Json -Compress");
          return ps.invoke();
    }

}