const schedule = require('node-schedule');
const request = require('request');
const { doSaveDate } = require('./storemark');
// 每天2點10分執行
var taskFreq = '00 10 14 * * *'
// var taskFreq = '10 * * * * *'


schedule.scheduleJob(taskFreq, () => {
    console.log('now is :' + new Date)
    doSaveDate()
})

