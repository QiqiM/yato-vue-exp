const gmLogger = require('../../utils/logger')('gm');
const appLogger = require('../../utils/logger')('app');
const mongoose = require('mongoose');
const mongodb = require('../mongodb');
const Schema = mongoose.Schema;

// 创建Schema
const permissionSchema = new Schema({
    code: { type: String, required: true },   // unique 以此字段为唯一索引
    name: { type: String, required: true },
    desc: { type: String },
    state: { type: Boolean },
    permission: { type: Array },
    timeStamp: { type: Date, default: Date.now }
}, { versionKey: false, bufferCommands: false, usePushEach: true });

let _model;
let getModel = function () {
    if (!_model)
        _model = mongodb.getMongodbConn("business").model('permission', permissionSchema);

    return _model;
}

module.exports.getModel = getModel;

