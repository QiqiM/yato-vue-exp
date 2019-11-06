
const db = require("../index").mysql;
const utils  = require("../../../utils/utils");
const constDef = require("../../../consts/constDef");
/*
`gs_province_code` VARCHAR(15) NOT NULL DEFAULT '',
`gs_city_code` VARCHAR(15) NOT NULL DEFAULT '',
`gs_area_code` VARCHAR(15) NOT NULL DEFAULT '',
`gs_type` VARCHAR(15) NOT NULL DEFAULT '' COMMENT '公司类型',
`gs_operating_years` VARCHAR(15) NOT NULL DEFAULT '',
`gs_ziben` INT(10) UNSIGNED NOT NULL DEFAULT '0',
`sw_type` INT(10) UNSIGNED NOT NULL DEFAULT '0',
`phone` VARCHAR(11) NOT NULL DEFAULT '',
`create_time` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
`uid` VARCHAR(32) NOT NULL DEFAULT '',
`note` VARCHAR(200) NOT NULL DEFAULT '',
 */


const fields = ["gs_type", "gs_operating_years", "gs_ziben", "sw_type", "phone", "create_time", "uid", "note", "state", "show_phone"];

const SQL = {
    INSERT:utils.genSqlInsert("purchase", fields),
    UPDATE: utils.genSqlUpdate("purchase", fields, ["id"]),
    UPDATE_STATE: "update purchase set state = ? where id = ?",
    DELETE: "delete from purchase where id = ?",
    QUERY_BY_STATE: "select * from purchase where state = ? order by create_time limit 40",
    QUERY_ALL: "select * from purchase limit 500"
};

const purchase = module.exports;



purchase.insert = function(data,cb){
    if(!data){
        return utils.invokeCallback(cb,new Error("param error!"));
    }
    const value = utils.resolveSql(fields, data);
    db.execStr(SQL.INSERT,value,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

purchase.updateAll = function (data, cb) {
    if(!data){
        return utils.invokeCallback(cb,new Error("param error!"));
    }

    const value = utils.resolveSql(fields, data);
    value.push(data.id);
    db.execStr(SQL.UPDATE,value,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

purchase.updateState = function (data, cb) {

    const value = [data.state, data.id];
    db.execStr(SQL.UPDATE_STATE,value,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

purchase.delete = function (id, cb) {
    if(!id){
        return utils.invokeCallback(cb,new Error("param error!"));
    }
    db.execStr(SQL.DELETE,[id],function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

purchase.queryPublish = function(cb){

    db.execStr(SQL.QUERY_BY_STATE,[constDef.purchaseState.publish],function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

purchase.queryAuth = function(cb){

    db.execStr(SQL.QUERY_BY_STATE,[constDef.purchaseState.init],function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};


purchase.queryAll = function (cb) {
    db.query(SQL.QUERY_ALL,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};