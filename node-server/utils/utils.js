const crypto = require("crypto");

const utils = module.exports;


/**
 *
 * @param ymd
 * @param hms
 * @returns {number}
 */
utils.formatTime = function (ymd, hms) {
    let year = Math.floor(ymd / 10000);
    let month = Math.floor(ymd / 100) % 100;
    let date = Math.floor(ymd % 100);
    let hour = Math.floor(hms / 10000);
    let minute = Math.floor(hms / 100) % 100;
    let second = Math.floor(hms % 100);
    let d = new Date(year, month - 1, date, hour, minute, second);
    return d.getTime();
};


utils.genTimeId = function () {
    return Date.now().toString(32);
};


utils.invokeCallback = function (cb, ...args) {
    if(typeof cb === "function"){
        cb(...args);
    }else {
        throw new Error("cb is not a function!");
    }
};

utils.genSqlInsert = function (table, fields) {
    let values = fields.map(prop => "?").join(",");
    let fieldlst = fields.join(",");
    let str =  ["insert","into", table, "(",fieldlst, ")","values","(", values, ")"];
    return str.join(" ");
};

utils.genSqlUpdate = function (table, fields, cond) {
    let values = fields.map(prop => `${prop} = ?`).join(",");
    let conds = cond.map(prop => `${prop} = ?`).join(" and ");
    let str = ["update", table, "set", values, "where", conds];
    return str.join(" ");
};

utils.resolveSql = function (fields, value) {
    return fields.map(field =>{
        return value[field]
    });
};


utils.encrypt = function (key, val="") {
    let t = crypto.createHash("md5");
    t.update(key);
    t.update(val);
    return t.digest('hex');
};


utils.defer = function () {
    let defer = {};
    defer.promise = new Promise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
};


utils.getTime = function () {
    return Math.floor(Date.now() / 1000);
}

utils.matcherOne = function (arr, key, val, valueKey) {
    const item = arr.find(el => el[key] === val);
    return item.hasOwnProperty(valueKey) ? item[valueKey] : null;
};

utils.random = function (len) {
    return Math.floor(Math.random() * len);
}