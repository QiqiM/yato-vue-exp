const gmLogger = require('../../utils/logger')('gm');
const appLogger = require('../../utils/logger')('app');
const mongoose = require('mongoose');
const mongodb = require('../mongodb');
const utils = require('../../utils/utils')
const Schema = mongoose.Schema;

// 创建Schema
const userSchema = new Schema({
    username: { type: String, unique: true },   // unique 以此字段为唯一索引
    password: { type: String },
    fullname: { type: String },
    email: { type: String },
    phone: { type: String },
    state: { type: Boolean },
    role: { type: Array },
    createTime: { type: Date, default: Date.now }
}, { collation: "user", versionKey: false, bufferCommands: false, usePushEach: true });

userSchema.statics.findByUsername = function (where, cb) {
    this.findOne(where, cb)
}

userSchema.statics.testCount = function (where, cb) {
    return this.countDocuments(where, cb)
}

let _model;
let getModel = function () {
    if (!_model)
        _model = mongodb.getMongodbConn("business").model('user', userSchema);

    return _model;
}

module.exports.getModel = getModel;

