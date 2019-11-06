const express = require('express');
const router = express.Router();
const sale = require("../dao/mysql/tables/sale");
const purchase = require("../dao/mysql/tables/purchase");
const enterprise = require("../dao/mysql/tables/enterprise");
const cooperation = require("../dao/mysql/tables/cooperation");
const gmLog = require("../utils/logger").gmLog;
const appLog = require("../utils/logger").appLog;
const constCode = require("../consts/constCode");
const utils = require("../utils/utils");
const constDef = require("../consts/constDef");
const Permission = require("../ctrl/permission");
const async = require("async");

router.get("/purchases", Permission.requireLogin(), function (req, resp) {
    purchase.queryAll(function(err, data){
        if(err){
            appLog.error("purchase_quickly_info error,%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({
            code: constCode.OK,
            data: data.map(row =>{
                return {
                    id: row.id,
                    gsType: row.gs_type,
                    gsOperatingYears: row.gs_operating_years,
                    gsZiben: row.gs_ziben,
                    swType: row.sw_type,
                    phone: row.phone,
                    note: row.note,
                    status: row.state,
                    showPhone:  row.show_phone
                }
            })
        })
    });
});

//发布购买
router.post('/purchases', Permission.requireLogin(), function(req, res) {
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

    gmLog.info("add purchase, data:%j", req.body);
    purchase.updateAll({
        id: req.body.id,
        gs_type: req.body.gsType,
        gs_operating_years: req.body.gsOperatingYears,
        gs_ziben: req.body.gsZiben,
        sw_type: req.body.swType,
        phone: req.body.phone,
        create_time: utils.getTime(),
        uid: "",
        note: req.body.note || "",
        show_phone: req.body.showPhone || "",
        state: constDef.purchaseState.publish
    }, function (err) {
        if(err){
            appLog.error("add purchase error,%j", err.stack);
            res.send({code: constCode.FAIL});
            return;
        }
        res.send({code: constCode.OK, data: constDef.purchaseState.publish});
    });
});

router.delete("/purchases",Permission.requireLogin(), function (req, resp) {
    gmLog.info("del purchase, data:%j", req.body);
    purchase.delete(req.body.id, function (err, res) {
        if(err){
            appLog.error("del purchase error,%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({code: constCode.OK});
    })
});

router.post('/stop_purchases', Permission.requireLogin(), function(req, res) {
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

    gmLog.info("stop purchase, data:%j", req.body);
    purchase.updateAll({
        id: req.body.id,
        gs_type: req.body.gsType,
        gs_operating_years: req.body.gsOperatingYears,
        gs_ziben: req.body.gsZiben,
        sw_type: req.body.swType,
        phone: req.body.phone,
        create_time: utils.getTime(),
        uid: "",
        note: req.body.note || "",
        show_phone: req.body.showPhone || "",
        state: constDef.purchaseState.stop
    }, function (err) {
        if(err){
            appLog.error("add purchase error,%j", err.stack);
            res.send({code: constCode.FAIL});
            return;
        }
        res.send({code: constCode.OK, data: constDef.purchaseState.stop});
    });
});



router.get("/sales", Permission.requireLogin(), function (req, resp) {
    sale.queryAll(function (err, rows) {
        if(err){
            appLog.error("add purchase error,%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({
            code:constCode.OK,
            data:rows.map(row =>{
                return {
                    id: row.id,
                    phone: row.phone,
                    note: row.note,
                    swType: row.sw_type,
                    gsName: row.gs_name,
                    gsPrice: row.gs_price,
                    gsType: row.gs_type,
                    createTime: new Date(row.create_time * 1000).toLocaleDateString()
                }
            })
        })
    })
});

router.delete("/sale",Permission.requireLogin(), function (req, resp) {
    sale.delete(req.body.id, function (err) {
        if(err){
            appLog.error("del sale error,%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({code: constCode.OK});
    });
});

router.post("/sale", Permission.requireLogin(), function (req, resp) {
    /**
     gsShowName:"",
     gsShowLegalPerson:"",
     gsName: this.showGs.gsName,
     gsPrice: this.showGs.gsPrice,
     gsId:"",//编号
     gsType: this.showGs.gsType,
     gsCreateTime:"2017-06-07",
     gsZiben: 0,
     gsIdNo:"", //统一社会信用码
     gsLocate:"",
     gsState:"", //经营状态
     gsLegalPerson:"", //法人
     gsEnterpriseType:"", //企业类型
     gsRegistration:"", //登记机关
     gsRegPlace:"",
     gsDesc:"", //简要说明,
     gsOperatingProject:"",
     swType:this.showGs.swType,//税务类型
     swTicket:"",//发票版本
     swBank:"",//开户银行
     swTaxStatus:"", //纳税情况
     swSocialSecurityNum: 0, //社保人数
     swAccountNum:0, //一般账户
     swDebtNum: 0, //债务条数
     tzType:"",
     tzBranchOffice: 0, //分支机构数
     tzMortgageGuaranteeNum: 0, //抵押担保次数
     gsOperatingYears:"", //经营年限
     tzShareholderNum: 2, //股东人数
     tzCreditHistoryNum: 0, //信用记录条数
     tzTradeType:"线上线下交易",//交易方式
     zcKnowledge:"", //知识产权
     zcWeb:"", //企业官网
     zcWechat:"", //微信公众号
     zcPatent:"", //专利版权
     zcOnlineShop:"",//网店平台
     zcSpread:"", //营销推广
     zcOther:"", //其他资产
     */
    let msg = req.body;
    console.log(msg);
    enterprise.insert({
        gs_show_name: msg.gsShowName,
        gs_show_legal_person: msg.gsShowLegalPerson,
        gs_name: msg.gsName,
        gs_price: msg.gsPrice,
        gs_type: msg.gsType,
        gs_create_time: msg.gsCreateTime,
        gs_ziben : msg.gsZiben,
        gs_id_no: msg.gsIdNo, //统一社会信用码
        gs_locate: msg.gsLocate,
        gs_state: msg.gsState, //经营状态
        gs_legal_person: msg.gsLegalPerson, //法人
        gs_registration: msg.gsRegistration, //登记机关
        gs_reg_place: msg.gsRegPlace,
        gs_desc: msg.gsDesc, //简要说明,
        gs_operating_project: msg.gsOperatingProject,
        sw_type:msg.swType,//税务类型
        sw_ticket: msg.swTicket,//发票版本
        sw_bank: msg.swBank,//开户银行
        sw_tax_status: msg.swTaxStatus, //纳税情况
        sw_social_security_num: msg.swSocialSecurityNum || 0, //社保人数
        sw_account_num: msg.swAccountNum, //一般账户
        sw_debt_num: msg.swDebtNum || 0, //债务条数
        tz_type: msg.tzType,
        tz_branch_office: msg.tzBranchOffice || 0, //分支机构数
        tz_mortgage_guarantee_num : msg.tzMortgageGuaranteeNum || 0, //抵押担保次数
        gs_operating_years: msg.gsOperatingYears, //经营年限
        tz_shareholder_num: msg.tzShareholderNum || 0, //股东人数
        tz_credit_history_num: msg.tzCreditHistoryNum || 0, //信用记录条数
        tz_trade_type: msg.tzTradeType,//交易方式
        zc_knowledge: msg.zcKnowledge, //知识产权
        zc_web: msg.zcWeb, //企业官网
        zc_wechat: msg.zcWechat, //微信公众号
        zc_patent: msg.zcPatent, //专利版权
        zc_online_shop: msg.zcOnlineShop,//网店平台
        zc_spread: msg.zcSpread, //营销推广
        zc_other: msg.zcOther, //其他资产
        publish_time: Math.floor(Date.now() / 1000),
        trade_status: constDef.saleState.publish
    },function (err) {
        if(err){
            appLog.error("add sale error,%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({code: constCode.OK});
    })
});



router.post("/trade", Permission.requireLogin(), function (req, resp) {
    enterprise.updatePart({
        id: parseInt(req.body.id),
        trade_status: parseInt(req.body.type)
    },function (err) {
        if(err){
            appLog.error("update trade status error,%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({code: constCode.OK});
    })
});



router.get("/trades", Permission.requireLogin(), function (req, resp) {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    let count = 0,
        data = [];
    async.parallel([function (cb) {
        enterprise.queryAll(page - 1, limit, function (err, rows) {
            if(err){
                return cb(err);
            }
            data = rows.map(row =>{
                return {
                    id: row.id,
                    gsName: row.gs_name,
                    gsType: row.gs_type,
                    gsOperatingYears: row.gs_operating_years,
                    gsPrice: row.gs_price,
                    gsZiben: row.gs_ziben,
                    swType: row.sw_type,
                    phone: row.phone,
                    tradeStatus: row.trade_status
                }
            });
            cb();
        })
    },function (cb) {
        enterprise.countAll(function (err, result) {
            if(err){
                return cb(err);
            }
            count = result[0].total;
            cb()
        });
    }],function (err) {
        if(err){
            appLog.error("get trades error,%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({code: constCode.OK, data: data, total: count});
    });
});

router.get("/detail", Permission.requireLogin(), function (req, resp) {
    enterprise.findOne(parseInt(req.query.id), function (err, rows) {
        if(err){
            appLog.error("get detail error,%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        if(rows.length === 0){
            appLog.error("get detail error, not find");
            resp.send({code: constCode.FAIL, message:"not find"});
            return;
        }

        let data = {
            id: rows[0].id,
            gsName: rows[0].gs_name,
            gsPrice: rows[0].gs_price,
            gsId: rows[0].id,//编号
            gsType:rows[0].gs_type,
            gsCreateTime: new Date(rows[0].gs_create_time * 1000).toLocaleDateString(),
            gsZiben: rows[0].gs_ziben,
            gsShuiwu: rows[0].sw_type,//税务类型
            gsIdNo: rows[0].gs_id_no, //统一社会信用码
            gsLocate: rows[0].gs_locate,
            gsState: rows[0].gs_state, //经营状态
            gsLegalPerson: rows[0].gs_legal_person, //法人
            gsRegistration: rows[0].gs_registration, //登记机关
            gsRegPlace:rows[0].gs_reg_place,
            gsDesc: rows[0].gs_desc, //简要说明,
            gsOperatingProject: rows[0].gs_operating_project,
            swTicket: rows[0].sw_ticket,//发票版本
            swBank: rows[0].sw_bank,//开户银行
            swTaxStatus: rows[0].sw_tax_status, //纳税情况
            swSocialSecurityNum: rows[0].sw_social_security_num, //社保人数
            swAccountNum: rows[0].sw_account_num, //一般账户
            swDebtNum: rows[0].sw_debt_num, //债务条数
            tzType: rows[0].tz_type,
            tzBranchOffice: rows[0].tz_branch_office, //分支机构数
            tzMortgageGuaranteeNum: rows[0].tz_mortgage_guarantee_num, //抵押担保次数
            gsOperatingYears: rows[0].gs_operating_years, //经营年限
            tzShareholderNum: rows[0].tz_shareholder_num, //股东人数
            tzCreditHistoryNum: rows[0].tz_credit_history_num, //信用记录条数
            tzTradeType: rows[0].tz_trade_type,//交易方式
            zcKnowledge: rows[0].zc_knowledge, //知识产权
            zcWeb: rows[0].zc_web, //企业官网
            zcWechat: rows[0].zc_wechat, //微信公众号
            zcPatent: rows[0].zc_patent, //专利版权
            zcOnlineShop: rows[0].zc_online_shop,//网店平台
            zcSpread: rows[0].zc_spread, //营销推广
            zcOther: rows[0].zc_other, //其他资产
        };
        resp.send({code: constCode.OK, data: data});
    });
});


router.get("/cooperation",  Permission.requireLogin(), function (req, resp) {
    cooperation.queryAll(function (err, rows) {
        if(err){
            appLog.error("cooperation error,%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({code: constCode.OK, data: rows});
    })
});
router.delete("/cooperation",  Permission.requireLogin(), function (req, resp) {
    cooperation.delete(req.body.id,function (err) {
        if(err){
            appLog.error("cooperation error,%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({code: constCode.OK });
    })
});
module.exports = router;