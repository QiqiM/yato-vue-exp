const db = require("../index").mysql;
const utils  = require("../../../utils/utils");

/**
 `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
 `gs_name` VARCHAR(100) NOT NULL DEFAULT '',
 `gs_price` INT(10) UNSIGNED NOT NULL DEFAULT '0',
 `gs_id` VARCHAR(18) NOT NULL DEFAULT '' COMMENT '--编号',
 `gs_type` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '广告传媒公司',
 `gs_create_time` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
 `gs_ziben` INT(10) UNSIGNED NOT NULL DEFAULT '0',
 `gs_id_no` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '--统一社会信用码',
 `gs_locate` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '--"南京****",',
 `gs_state` VARCHAR(10) NOT NULL DEFAULT '' COMMENT '--经营状态',
 `gs_legal_person` VARCHAR(10) NOT NULL DEFAULT '' COMMENT '--"陈**", //法人',
 `gs_enterprise_type` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '--"小规模类纳税人", //企业类型',
 `gs_registration` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '--"南京工商行政管理局", //登记机关',
 `gs_reg_place` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '--"南京***",',
 `gs_desc` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '--简要说明,',
 `gs_operating_project` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '-- 经营项目 "文化艺术交流活动策划；",',
 `sw_type` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '--"小规模类纳税人",//税务类型',
 `sw_ticket` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--:"万元版",//发票版本',
 `sw_bank` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '-- "工商银行",//开户银行',
 `sw_tax_status` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '-- "正常", //纳税情况',
 `sw_social_security_num` INT(11) NOT NULL DEFAULT '0' COMMENT '--社保人数',
 `sw_account_num` INT(11) NOT NULL DEFAULT '0' COMMENT '--一般账户',
 `sw_debt_num` INT(11) NOT NULL DEFAULT '0' COMMENT '--债务条数',
 `tz_type` INT(11) NOT NULL DEFAULT '0' COMMENT '-- "内资公司",',
 `tz_branch_office` INT(11) NOT NULL DEFAULT '0' COMMENT '--分支机构数',
 `tz_mortgage_guarantee_num` INT(11) NOT NULL DEFAULT '0' COMMENT '--抵押担保次数',
 `tz_operating_years` INT(11) NOT NULL DEFAULT '0' COMMENT '--经营年限',
 `tz_shareholder_num` INT(11) NOT NULL DEFAULT '0' COMMENT '--股东人数',
 `tz_credit_historyNum` INT(11) NOT NULL DEFAULT '0' COMMENT '--信用记录条数',
 `tz_trade_type` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--"线上线下交易",//交易方式',
 `zc_knowledge` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '--知识产权',
 `zc_web` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--企业官网',
 `zc_wechat` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--微信公众号',
 `zc_patent` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--专利版权',
 `zc_online_shop` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--网店平台',
 `zc_spread` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--营销推广',
 `zc_other` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '--其他资产,',
 `trade_status` SMALLINT(5) UNSIGNED NOT NULL DEFAULT '0' COMMENT '交易状态',
 */

const fields = ["gs_name","gs_show_name", "gs_show_legal_person", "gs_price", "gs_type", "gs_create_time", "gs_ziben", "gs_id_no", "gs_locate",
    "gs_state", "gs_legal_person", "gs_registration", "gs_reg_place", "gs_desc", "gs_operating_project",
    "sw_type", "sw_ticket", "sw_bank", "sw_tax_status", "sw_social_security_num", "sw_account_num", "sw_debt_num", "zc_wechat",
    "tz_type", "tz_branch_office", "tz_mortgage_guarantee_num", "gs_operating_years", "tz_shareholder_num", "tz_credit_history_num",
    "tz_trade_type", "zc_knowledge", "zc_web", "zc_patent", "zc_online_shop", "zc_spread", "zc_other", "trade_status", "publish_time"
];

const SQL = {
    INSERT:utils.genSqlInsert("enterprise", fields),
    UPDATE:utils.genSqlUpdate("enterprise", fields, ["id"]),
    QUERY_BY_STATE: "select * from enterprise where trade_status = ? order by publish_time DESC  limit ? offset ?",
    QUERY_ALL: "select * from enterprise where trade_status > 0  order by publish_time DESC  limit ? offset ?",
    COUNT_ALL: "select count(1) as total from enterprise",
    SEARCH_GS_TYPE: "select * from enterprise where gs_type LIKE ? limit 500",
    SEARCH_GS_CREATE_TIME:"select * from enterprise where gs_create_time between ? and ? limit 500",
    COUNT_BY_STATE: "select count(1) as total from enterprise where trade_status = ?",
    FIND_ONE: "select * from enterprise where id = ? limit 1"
};


const TradeStatus = {
    publish: 1,
    in_trade: 2,
    done: 3
}

const enterprise = module.exports;

enterprise.insert = function(data,cb){
    if(!data){
        return utils.invokeCallback(cb,new Error("param error!"));
    }
    const value = utils.resolveSql(fields, data);
    db.execStr(SQL.INSERT,value,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

enterprise.update = function(data,cb){
    if(!data){
        return utils.invokeCallback(cb,new Error("param error!"));
    }
    const value = utils.resolveSql(fields, data);
    value.push(data.id);
    db.execStr(SQL.UPDATE,value,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

enterprise.updatePart = function (data, cb) {
    let updatefiels = fields.filter(key => data.hasOwnProperty(key) && key !== "id");
    const value = utils.resolveSql(updatefiels, data);
    value.push(data.id);
    const sql = utils.genSqlUpdate("enterprise", updatefiels, ["id"]);
    db.execStr(sql,value,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

enterprise.queryPublishList = function (page, limit, cb) {
    const values = [ TradeStatus.publish, limit, page * limit];
    db.execStr(SQL.QUERY_BY_STATE, values,function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

enterprise.countByState = function(state, cb){
    db.execStr(SQL.COUNT_BY_STATE, [state],function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

enterprise.searchGsType = function (key, cb) {
    db.execStr(SQL.SEARCH_GS_TYPE, [`%${key}%`],function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

enterprise.searchGsCreateTime = function (start, end, cb) {
    db.execStr(SQL.SEARCH_GS_CREATE_TIME, [start, end],function(err,res){
        utils.invokeCallback(cb,err,res);
    });
};

enterprise.queryAll = function (page, limit, cb) {
    db.execStr(SQL.QUERY_ALL, [limit, page * limit], function (err, res) {
        utils.invokeCallback(cb,err,res);
    })
};

enterprise.countAll = function (cb) {
    db.query(SQL.COUNT_ALL, function (err, res) {
        utils.invokeCallback(cb,err,res);
    });
};

enterprise.findOne = function (id, cb) {
    db.execStr(SQL.FIND_ONE,[id], function (err, res) {
        utils.invokeCallback(cb,err,res);
    });
};