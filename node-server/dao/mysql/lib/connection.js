/**
 * Created by zwp on 2015/11/7.
 */

var logger          = require('../../../utils/logger').appLog;
var mysql           = require('mysql');
var emitter         = require("events").EventEmitter;
var util            = require("util");
var PING_INTERVAL_TIME = 30000;
var RECONNECT_DELAY  = 30 * 1000;
/**
 * @param {opts} opts
 */
var CONN_STATE = {
    READY:0,
    UNREADY:1
};

var connection = function(opts) {
    emitter.call(this);
    opts = opts || {};
    this.dbConfig = {};
    this.dbConfig['host'] = opts.host;
    this.dbConfig['port'] = opts.port;
    this.dbConfig['user'] = opts.user;
    this.dbConfig['password'] = opts.password;
    this.dbConfig['database'] = opts.database;
    //this.dbConfig['connectTimeout'] = opts.connectTimeout;
    this.conn = null;
    this.destroying = false;
    this.state = CONN_STATE.UNREADY;
    this.pingTimer = null;
};

util.inherits(connection,emitter);


module.exports = connection;
var pro = connection.prototype;

/**
 * connect
 * @param
 */
pro.connect = function(cb) {
    var self = this;
    this.state = CONN_STATE.UNREADY;
    if (!!this.conn){
        cb(new Error('mysql had connected!!!'));
        return;
    }

    this.conn = mysql.createConnection(this.dbConfig);
    if (!this.conn){
        cb(new Error('mysql createConnection failed!!!'));
        return;
    }

    this.conn.on('error', function(err){
        logger.fatal('mysql db error: %j, code: %j', err.message, err.code);
        //self.emit("error",err);
    });

    this.conn.on('connect', function(){
        logger.info('mysql db connect success!!!');
        self.state = CONN_STATE.READY;
        self.emit("connect");
    });

    var self = this;
    this.conn.on('end', function(err){
        logger.fatal('mysql db end, error: %j, code: %j', err.message, err.code);
        self.conn.end();
        self.conn = null;
        self.state = CONN_STATE.UNREADY;
        if (!self.destroying){
            var delay = Math.floor((1+Math.random()) * RECONNECT_DELAY);
            logger.warn('schedule reconnect mysql after %d microseconds', delay);
            setTimeout(function(){
                self.connect(function(err){
                    if (err) {
                        logger.warn('try to connect mysql db error: ' + err.message);
                    }
                });
            },delay);
            self.emit("disconnect");
        }else{
            self.emit("destroy");
        }
    });
    this.conn.connect(function(err){
        if (err){
            cb(new Error(err.message));
            return;
        }

        if(!!self.pingTimer)
            clearInterval(self.pingTimer);
        self.pingTimer = setInterval(ping.bind(self), PING_INTERVAL_TIME);

        cb(null);
    });
};

/**
 * ping
 * @param
 */
var ping = function(){
    if(this.conn){
        this.conn.ping(function(err){
            if(err){
                logger.fatal("mysql ping failed!!! error:%j", err.message);
            }else{
                //logger.debug("mysql ping success!!!");
            }
        });
    }
};

/**
 * end
 * @param {startRedis} true/false
 */
pro.destroy = function() {
    if (!!this.conn){
        this.destroying = true;
        this.conn.end();
        this.conn = null;
    }
};

/**
 * getConnectionState
 * @param
 */

pro.isReady = function(){
    return this.state == CONN_STATE.READY;
};

pro.getConnection = function(cb){
    if(this.state != CONN_STATE.READY){
        cb(null);
        return;
    }
    if (!this.conn){
        logger.debug('try to connect mysql db...');
        var self = this;
        this.connect(function(err){
            if (err){
                cb(null);
            }else{
                cb(self.conn);
            }
        });
    }else{
        cb(this.conn);
    }
};