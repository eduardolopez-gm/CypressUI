const report = require('multiple-cucumber-html-reporter')

report.generate({
    jsonDir: 'cypress/cucumber-json',
// ** Path of .json file **// 
    reportPath: 'cypress/reports/',
metadata: { 
    browser:{
        name: 'chrome',
        version: '122',
    },
    device: 'Local machine',
    platform: { name: 'windows',
    version: '11',
    },
},
});