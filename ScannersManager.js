module.exports = {
    scanners : [
        require('./Scanners/Services'),
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
        require('./Scanners/ScheduledTasks'),
    ],


}






