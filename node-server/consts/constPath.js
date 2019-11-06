const path = require("path");
const constPath = module.exports;
const fs = require("fs");
constPath.LOG_DIR = path.join(__dirname, "../logs");

if(!fs.existsSync(constPath.LOG_DIR)){
    fs.mkdirSync(constPath.LOG_DIR);
}