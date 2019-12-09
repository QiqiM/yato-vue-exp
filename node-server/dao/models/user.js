const gmLogger = require('../../utils/logger')('gm');
const appLogger = require('../../utils/logger')('app');
const mongoose = require('mongoose');
const mongodb = require('../mongodb');
const utils = require('../../utils/utils')
const Schema = mongoose.Schema;

// 创建Schema
const userSchema = new Schema({
    username: { type: String },
    password: { type: String },
    email: { type: String },
    role: { type: String }
}, { collation: "user", versionKey: false, bufferCommands: false, usePushEach: true });

userSchema.statics.findByUsernameAndPwd = function (username, pwd, cb) {
    this.findOne({ username: username, password: pwd }, cb)
}

userSchema.statics.findAll = function (cb) {
    this.find({}, cb)
}

let _model;
let getModel = function () {
    if (!_model)
        _model = mongodb.getMongodbConn("business").model('user', userSchema);

    return _model;
}

module.exports.getModel = getModel;

