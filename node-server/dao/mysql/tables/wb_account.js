const db = require("../index").mysql;
const utils  = require("../../../utils/utils");

const fields = ["account_id", "password", "role"]

const SQL = {
    INSERT:utils.genSqlInsert("wb_account", fields),
    SELECT: "select * from wb_account where account_id = ?",
    QUERY_ALL: "select * from wb_account limit 10000",
    UPDATE_PASSWORD: "update wb_account set password = ? where account_id = ?"
};

const wbAccount = module.exports;

wbAccount.insert = function(data,cb){
    if(!data){
        return utils.invokeCallback(cb,new Error("param error!"));
    }
    const value = utils.resolveSql(fields, data);
    db.execStr(SQL.INSERT,value,function(err,res){
        utils.invokeCallback(cb,err,res);
    })
};

wbAccount.find = function (accountId, cb) {
    if(!accountId){
        return utils.invokeCallback(cb,new Error("param error!"));
    }
    const value = [accountId]
    db.execStr(SQL.SELECT,value,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

wbAccount.updatePassword = function (accountId, password, cb) {
    if(!accountId || !password){
        return utils.invokeCallback(cb,new Error("param error!"));
    }
    const value = [password, accountId]
    db.execStr(SQL.UPDATE_PASSWORD, value, function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

wbAccount.findAll = function (cb) {
    db.execStr(SQL.QUERY_ALL,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};