/**
 * Created by Administrator on 2017/11/21.
 */
var connection      = require('./connection');
var multiConn       = require("./multiConnection");

var utils = require('../../../utils/utils');
var util            = require("util");
var sqlParser = require("./sqlParser");
var Emitter         = require("events").EventEmitter;
var async = require("async");
var exp = module.exports;
var conn = null;
var _options = {
    reconnect: true,
    reconnectInterval: 3000
}

var DB_STATE = {
    READY:0,
    UNREADY:1
};

var database = function(){
    Emitter.call(this);
    this.state = DB_STATE.UNREADY;
    this.conn = null;
};

util.inherits(database,Emitter);

database.prototype.query = function(str, cb){
    if(!this.conn){
        utils.invokeCallback(cb, new Error("connection not init!!"));
        return;
    }
    this.conn.getConnection(function(err,con){
        if(err) return utils.invokeCallback(cb, err);
        con.query(str,function(err, res){
            utils.invokeCallback(cb,err,res);
        });
    })
};


database.prototype.execStr = function(str,values,cb){
    if(!this.conn){
        utils.invokeCallback(cb, new Error("connection not init!!"));
        return;
    }
    this.conn.getConnection(function(err,con){
        if(err) return utils.invokeCallback(cb, err);
        con.query(str,values,function(err, res){
            utils.invokeCallback(cb,err,res);
        });
    })
};

database.prototype.destroy = function(){
    if(this.conn)
        this. conn.end();
};

database.prototype.init = function(options,cb){
    if(typeof  options === "function"){
        cb = options;
        options = {};
    }else{
        _options.reconnect = options.reconnect || _options.reconnect;
        _options.reconnectInterval = options.reconnectInterval || _options.reconnectInterval;
    }

   var self =this;
    var conn = this.conn = new multiConn(options);
    conn.on("ready",function(){
        self.state = DB_STATE.READY;
        self.emit("ready");
    });
    conn.on("unready",function(){
        self.state = DB_STATE.UNREADY;
        self.emit("unready");
    });
    var callback = false;
    var connect = function() {
        conn.connect(function (err) {
            if(!callback){
                callback = true;
                utils.invokeCallback(cb, err);
            }
            /**
            if (err && _options.reconnect) {
                setTimeout(function () {
                    connect();
                },_options.reconnectInterval);
            }
             **/
        });
    };
    connect();
};

database.prototype.isReady = function(){
    return this.state == DB_STATE.READY;
};

module.exports = database;