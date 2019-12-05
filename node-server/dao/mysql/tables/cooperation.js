const db = require("../index").mysql;
const utils  = require("../../../utils/utils");

const fields = ["note", "phone"];

const SQL = {
    INSERT:utils.genSqlInsert("cooperation", fields),
    QUERY_ALL:"select * from cooperation limit 500",
    DELETE: "delete from cooperation where id = ?"
};

const cooperation = module.exports;

cooperation.insert = function(data,cb){
    if(!data){
        return utils.invokeCallback(cb,new Error("param error!"));
    }
    const value = utils.resolveSql(fields, data);
    db.execStr(SQL.INSERT,value,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

cooperation.queryAll = function (cb) {
    db.query(SQL.QUERY_ALL,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

cooperation.delete = function (id, cb) {
    db.execStr(SQL.DELETE,[id],function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};
