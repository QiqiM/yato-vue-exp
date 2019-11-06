const fileStreamRotator = require("file-stream-rotator");
const logDir = require("../consts/constPath").LOG_DIR;
const util = require('util');

const stdout = process.stdout;
class Log{
    constructor(stream){
        this.stream = stream;
        this.date = new Date();
    }

    getDateTime(){
        return [this.date.toLocaleDateString(), this.date.toLocaleTimeString()].join(" ");
    }

    log(tag, smt, ...options){
        let logData = util.format(smt, ...options);
        logData = [`[${tag}]`, this.getDateTime(), logData, "\r\n"].join(" ");
        this.stream.write(logData);
        if(console[tag]) console[tag](logData)
        else console.log(logData);
    }

    info(smt, ...options){
        this.log("info", smt, ...options);
    }

    error(smt, ...options){
        this.log("error", smt, ...options);
    }

    warning(smt, ...options){
        this.log("warning", smt, ...options);
    }

    fatal(smt, ...options){
        this.log("fatal", smt, ...options);
    }

    getStream(){
        return this.stream;
    }
}


const gmLogStream  = fileStreamRotator.getStream(
    {
        filename:`${logDir}/gm/%DATE%.log`,
        frequency:"15d",
        verbose: false,
        date_format: "YYYY-MM-DD",
        size: "5M" // its letter denominating the size is case insensitive
    }
);

const appLogStream  = fileStreamRotator.getStream(
    {
        filename:`${logDir}/app/%DATE%.log`,
        frequency:"15d",
        verbose: false,
        date_format: "YYYY-MM-DD",
        size: "5M" // its letter denominating the size is case insensitive
    }
);

const gmLog = new Log(gmLogStream);

const appLog = new Log(appLogStream);


module.exports = {
    gmLog,
    appLog
};