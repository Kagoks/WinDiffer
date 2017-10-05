module.exports = {
    scanners : [
        require('./Scanners/InstalledPrograms64Bits'),
        require('./Scanners/InstalledPrograms32Bits'),
        require('./Scanners/UserStartMenuItems'),
        require('./Scanners/CommonStartMenuItems'),
        require('./Scanners/UserWordAddins'),
        require('./Scanners/MachineWordAddins'),        
        require('./Scanners/UserExcelAddins'),
        require('./Scanners/MachineExcelAddins'),        
        require('./Scanners/UserOutlookAddins'),
        require('./Scanners/MachineOutlookAddins'),
        require('./Scanners/CommonDefaultFolders'),
        require('./Scanners/UserDefaultFolders'),
        require('./Scanners/UserEnvVariables'),
        require('./Scanners/SystemEnvVariables'),
        require('./Scanners/Services'),   
        require('./Scanners/ScheduledTasks'),
        require('./Scanners/AvailableSpaceOfFixedDrives'),
        require('./Scanners/RootOfFixedDrives'),
        require('./Scanners/RootOfMyDocumentsFolder'),
        require('./Scanners/ActiveXControls'),
        require('./Scanners/Printers'),

        
    ],


}






