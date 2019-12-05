/**
 * Created by Administrator on 2017/4/21.
 */
const connection = require("./connection");
const async = require("async");
const utils = require("../../../utils/utils");
const util = require("util");
const EventEmitter = require("events").EventEmitter;

/**
 *
 * @param opts  数据库配置参数
 */
const CONN_STATE = {
    UNREADY: 1,
    READY: 2
}

const multiConnection = function (opts) {
    EventEmitter.call(this);
    this.connectionMap = {};
    this.index = 0;
    this.multiNumber = opts.multiConnNum || 2;
    this.options = opts;
    this.inited = false;
    this.state = CONN_STATE.UNREADY;
    init(this, opts);
};

util.inherits(multiConnection, EventEmitter);

multiConnection.prototype.getNextIndex = function () {
    let dex = (this.index + 1) % this.multiNumber;
    this.index = dex;
    return dex;
};


multiConnection.prototype.getConnection = function (cb) {
    if (this.state == CONN_STATE.UNREADY) {
        return utils.invokeCallback(cb, new Error("multi connection  not ready!"));
    }
    let dex = -1;
    let bFind = false;
    for (let i = 0; i < this.multiNumber; i++) {
        dex = this.getNextIndex();
        if (this.connectionMap[dex].isReady()) {
            bFind = true;
            break;
        }
    }
    if (dex === -1 || !bFind) {
        this.state = CONN_STATE.UNREADY;
        this.emit("unready");
        return utils.invokeCallback(cb, new Error("can find valid connection!"))
    }
    this.connectionMap[dex].getConnection(function (conn) {
        if (!conn) {
            return utils.invokeCallback(cb, new Error("can find valid connection!"), conn);
        }
        utils.invokeCallback(cb, null, conn);
    })

};

let hasUsefulConn = function (conns) {
    let keys = Object.keys(conns.connectionMap);
    let bHas = false;
    for (let i = 0; i < keys.length; i++) {
        bHas = conns.connectionMap[keys[i]].isReady() || bHas;
    }
    return bHas;
}

let init = function (conns, opts) {
    for (let i = 0; i < opts.multiConnNum; i++) {
        let con = new connection(opts);
        conns.connectionMap[i] = con;
        con.on("connect", function () {
            if (conns.state == CONN_STATE.UNREADY) {
                conns.state = CONN_STATE.READY;
                console.log("ready")
                conns.emit("ready");
            }
        });
        con.on("disconnect", function () {
            if (conns.state == CONN_STATE.READY && !hasUsefulConn(conns)) {
                conns.state = CONN_STATE.UNREADY;
                conns.emit("unready");
            }
        });
        con.on("destroy", function () {
            if (conns.state == CONN_STATE.READY && !hasUsefulConn(conns)) {
                conns.state = CONN_STATE.UNREADY;
                conns.emit("unready");
            }
        });
    }
};

multiConnection.prototype.destroy = function () {
    for (let e in this.connectionMap) {
        this.connectionMap[e].destroy();
    }
};

multiConnection.prototype.connect = function (cb) {
    let conns = [];
    for (let e in this.connectionMap) {
        if (!this.connectionMap[e].isReady())
            conns.push(this.connectionMap[e]);
    }
    async.map(conns, function (con, done) {
        con.connect(done);
    }, function (err) {
        utils.invokeCallback(cb, err);
    })
};



multiConnection.prototype.isReady = function () {
    return this.state == CONN_STATE.READY;
};

module.exports = multiConnection;