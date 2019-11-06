/**
 * Created by Administrator on 2017/11/21.
 */
var utils = require('../../../utils/utils');
var Database = require("./database");
var sqlParser = require("./sqlParser");
var async = require("async");

var multiDatabase = function(){
    this.dblst = [];
    this.useTableIndex = {};
};

multiDatabase.prototype.init = function(options, cb){
    var self = this;

    if(!Array.isArray(options)){
        options = [options];
    }
    for(var i =0; i < options.length; i++){
        options[i].index = i;
    }
    var dblst =  this.dblst = new Array(options.length);
    async.map(options,function(config, done){
        var i = config.index;
        var db = new Database();
        dblst[i] = db;
        db.init(config,done);
    },function(err){
        utils.invokeCallback(cb,err);
    });
};

multiDatabase.prototype.getDb = function(table){
    if(!this.useTableIndex[table]){
        this.useTableIndex[table] = 1;
    }
    var len = this.dblst.length;
    for(var i = 0; i < len; i ++){
        var index = this.useTableIndex[table] % len;
        this.useTableIndex[table] ++;
        if(this.dblst[index].isReady()){
            return this.dblst[index];
        }
    }
    return null;
};

multiDatabase.prototype.execStr = function(str,values,cb){
    var table = sqlParser.getVirtualTableName(str);
    var db = this.getDb(table);
    if(!db){
        utils.invokeCallback(cb, new Error("database unready!"));
        return;
    }
    db.execStr(str, values, cb);
};

multiDatabase.prototype.query = function(str, cb){
    var table = sqlParser.getVirtualTableName(str);
    var db = this.getDb(table);
    if(!db){
        utils.invokeCallback(cb, new Error("database unready!"));
        return;
    }
    db.query(str,cb);
};

module.exports = multiDatabase;