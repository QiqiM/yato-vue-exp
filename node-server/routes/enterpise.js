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

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


//搜索
router.post('/search', function(req, resp) {

    const next = function (err, data) {
        if(err){
            appLog.error("search error, query:%j stack:%j",req.body, err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({
            code: constCode.OK,
            data: data
        });
    }
    switch (parseInt(req.body.type)){
        case 0:
            enterprise.searchGsType(req.body.data, next);
            break;
        case 1:
            let key = req.body.data + "";
            let year = key.match(/\d{4}/);
            if(!year) next(null, []);
            else {
                let start = new Date();
                start.setFullYear(Number(year[0]), 0, 0);
                enterprise.searchGsCreateTime(Math.floor(start.getTime() / 1000), Math.floor(start.getTime()/1000) + 86400 * 365, next);
            }
            break;
        default:
            next(new Error("invalid type"));
    }
});



router.get("/publish_list", function (req, resp) {
    let page = req.query.page || 0;
    const limit = 15;
    enterprise.queryPublishList(page, limit, function (err, res) {
        if(err){
            appLog.error("queryPublishList error, page:%j, limit:%j, stack:%j", page, limit, err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({
            code: constCode.OK,
            data:res
        });
    });
});

router.get('/quicklyInfo', function (req, resp) {
    enterprise.queryPublishList(0, 50, function (err, rows) {
        if(err){
            appLog.error("quicklyInfo error, stack:%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({
            code: constCode.OK,
            data: rows.map(row =>{
                return {
                    id: row.id,
                    gsName: row.gs_show_name,
                    gsPrice : row.gs_price,
                    publishTime: new Date(row.publish_time * 1000).toLocaleDateString()
                }
            })
        });
    });
});

//发布出售
router.post('/sale', function(req, res) {
    /**
     * 	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
     `province_code` VARCHAR(15) NOT NULL DEFAULT '',
     `city_code` VARCHAR(15) NOT NULL DEFAULT '',
     `area_code` VARCHAR(15) NOT NULL DEFAULT '',
     `phone` VARCHAR(11) NOT NULL DEFAULT '',
     `uid` VARCHAR(32) NOT NULL DEFAULT '',
     `state` INT(10) UNSIGNED NOT NULL DEFAULT '0',
     `note` VARCHAR(200) NOT NULL DEFAULT '',
     `sw_type` INT(11) NOT NULL DEFAULT '0',
     `gs_name` VARCHAR(30) NOT NULL DEFAULT '',
     `gs_price` INT(11) NOT NULL DEFAULT '0',
     `gs_type` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '经营类型',
     `create_time` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
     */
    gmLog.info("add sale, data:%j", req.body);
    sale.insert({
        province_code: "",
        city_code: "",
        area_code: "",
        phone: req.body.phone,
        uid: req.body.uid,
        state: req.body.state || "0",
        note: req.body.note,
        sw_type:req.body.swType,
        gs_name: req.body.gsName,
        gs_price: req.body.gsPrice,
        gs_type: req.body.gsType,
        create_time: Math.floor(Date.now() / 1000)
    },function (err) {
        if(err){
            appLog.error("add purchase error,%j", err.stack);
            res.send({code: constCode.FAIL});
            return;
        }
        res.send({code: constCode.OK});
    });
});

//发布购买
router.post('/quickly_purchase', function(req, res) {
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
    purchase.insert({
        gs_type: req.body.gsType,
        gs_operating_years: req.body.gsOperatingYears,
        gs_ziben: req.body.gsZiben,
        sw_type: req.body.swType,
        phone: req.body.phone,
        create_time: utils.getTime(),
        uid: "",
        note: req.body.note || "",
        show_phone: "",
        state: constDef.purchaseState.init
    }, function (err) {
        if(err){
            appLog.error("add purchase error,%j", err.stack);
            res.send({code: constCode.FAIL});
            return;
        }
        res.send({code: constCode.OK});
    });
});

router.get("/purchase_quickly_info", function (req, resp) {
    purchase.queryPublish(function(err, data){
        if(err){
            appLog.error("purchase_quickly_info error,%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({
            code: constCode.OK,
            data: data.map(row =>{
                return {
                    gsType: utils.matcherOne(req.app.dbJson.gsTypes, "value", row.gs_type, "name"),
                    authTime: new Date(row.auth_time * 1000).toLocaleDateString(),
                    showPhone: row.show_phone,
                    gsOperatingYears: utils.matcherOne(req.app.dbJson.operatingYears, "value", row.gs_operating_years, "name"),
                }
            })
        })
    });
});


router.post("/cooperation", function (req, resp) {
    cooperation.insert(req.body, function (err) {
        if(err){
            appLog.error("cooperation error,%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({code: constCode.OK});
    })
});



router.get("/scan", function (req, resp) {
    let page = parseInt(req.query.currentPage) || 1;
    let limit = parseInt(req.query.limit) || 15;
    if(!!req.query.count){
        enterprise.countByState(constDef.saleState.publish, function (err, rows) {
            if(err){
                appLog.error("scan count error, stack:%j", err.stack);
                resp.send({code: constCode.FAIL});
                return;
            }
            resp.send({
                code: constCode.OK,
                data: rows[0].total
            })
        });
        return;
    }
    enterprise.queryPublishList(page - 1, limit, function (err, rows) {
        if(err){
            appLog.error("scan error, stack:%j", err.stack);
            resp.send({code: constCode.FAIL});
            return;
        }
        resp.send({
            code: constCode.OK,
            data: rows.map(row =>{
                return {
                    id: row.id,
                    gsName: row.gs_show_name,
                    gsPrice : row.gs_price,
                    gsType: row.gs_type,
                    gsZiben: row.gs_ziben,
                    swType: row.sw_type,
                    gsCreateTime: new Date(row.gs_create_time * 1000).toLocaleDateString(),
                    publishTime: new Date(row.publish_time * 1000).toLocaleDateString()
                }
            })
        });
    });
});


//详细信息
router.get('/detail', function(req, resp) {
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
            gsShowName: rows[0].gs_show_name,
            gsShowLegalPerson: rows[0].gs_show_legal_person,
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
            gsLegalPerson: rows[0].gs_show_legal_person, //法人
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
            swType: rows[0].sw_type,
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


module.exports = router;