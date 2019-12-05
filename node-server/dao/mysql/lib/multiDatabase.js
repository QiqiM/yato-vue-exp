/**
 * Created by Administrator on 2017/11/21.
 */
const utils = require('../../../utils/utils');
const Database = require("./database");
const sqlParser = require("./sqlParser");
const async = require("async");

const multiDatabase = function(){
    this.dblist = [];
    this.useTableIndex = {};
};

multiDatabase.prototype.init = function(options, cb){
    let self = this;

    if(!Array.isArray(options)){
        options = [options];
    }
    for(let i =0; i < options.length; i++){
        options[i].index = i;
    }
    let dblist =  this.dblist = new Array(options.length);
    async.map(options,function(config, done){
        let i = config.index;
        let db = new Database();
        dblist[i] = db;
        db.init(config,done);
    },function(err){
        utils.invokeCallback(cb,err);
    });
};

multiDatabase.prototype.getDb = function(table){
    if(!this.useTableIndex[table]){
        this.useTableIndex[table] = 1;
    }
    let len = this.dblist.length;
    for(let i = 0; i < len; i ++){
        let index = this.useTableIndex[table] % len;
        this.useTableIndex[table] ++;
        if(this.dblist[index].isReady()){
            return this.dblist[index];
        }
    }
    return null;
};

multiDatabase.prototype.execStr = function(str,values,cb){
    let table = sqlParser.getVirtualTableName(str);
    let db = this.getDb(table);
    if(!db){
        utils.invokeCallback(cb, new Error("database unready!"));
        return;
    }
    db.execStr(str, values, cb);
};

multiDatabase.prototype.query = function(str, cb){
    let table = sqlParser.getVirtualTableName(str);
    let db = this.getDb(table);
    if(!db){
        utils.invokeCallback(cb, new Error("database unready!"));
        return;
    }
    db.query(str,cb);
};

module.exports = multiDatabase;