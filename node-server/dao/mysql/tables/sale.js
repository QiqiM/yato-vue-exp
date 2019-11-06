const db = require("../index").mysql;
const utils  = require("../../../utils/utils");

/**
 `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
 `province_code` VARCHAR(15) NOT NULL DEFAULT '',
 `city_code` VARCHAR(15) NOT NULL DEFAULT '',
 `area_code` VARCHAR(15) NOT NULL DEFAULT '',
 `sw_type` INT(11) NOT NULL DEFAULT '0',
 `gs_name` VARCHAR(30) NOT NULL DEFAULT '',
 `gs_price` INT(11) NOT NULL DEFAULT '0',
 `gs_type` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '经营类型',
 `create_time` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
 `phone` VARCHAR(11) NOT NULL DEFAULT '',
 `uid` VARCHAR(32) NOT NULL DEFAULT '',
 `state` INT(10) UNSIGNED NOT NULL DEFAULT '0',
 `note` VARCHAR(200) NOT NULL DEFAULT '',
 * @type {string[]}
 */


const fields = [ "sw_type", "gs_name", "gs_price", "gs_type", "phone", "create_time", "note"];

const SQL = {
    INSERT:utils.genSqlInsert("sale", fields),
    QUERY_ALL: "select * from sale limit 500",
    DELETE: "delete from sale where id = ?"
};

const sale = module.exports;

sale.insert = function(data,cb){
    if(!data){
        return utils.invokeCallback(cb,new Error("param error!"));
    }
    const value = utils.resolveSql(fields, data);
    db.execStr(SQL.INSERT,value,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

sale.queryAll = function (cb) {
    db.query(SQL.QUERY_ALL,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

sale.delete = function (id, cb) {
    db.execStr(SQL.DELETE, [id],function(err,res){
        utils.invokeCallback(cb,err,res);
    });
}