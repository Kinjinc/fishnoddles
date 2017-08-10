const log4js = require('log4js');
const config = require('../conf/config')
// 可以为日志设置不同的类别,这样就知道log信息来源于哪一个库表
let log = log4js.getLogger(config.mongoDatabase)
const isTest  = process.env.NODE_ENV === "TEST"

module.exports = isTest ? {
    debug: () => {},
    info: () => {},
    log: () => {},
    error: () => {},
    warn: () => {}
} : log
