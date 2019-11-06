const express = require('express');
const router = express.Router();
const constCode = require("../consts/constCode");
const utils = require("../utils/utils");
/* GET users listing. */
router.get('/provinces', function(req, res, next) {
    res.send({
        code: constCode.OK,
        data:req.app.dbJson.provinces,
    });
});


router.get('/cities', function(req, res, next) {
    let provinceCode = req.query.provinceCode;
    let cities = req.app.dbJson.cities.filter(city => city.provinceCode === provinceCode);
    res.send({
        code: constCode.OK,
        data:cities
    });
});

router.get('/areas', function(req, res, next) {
    let cityCode = req.query.cityCode;
    let areas = req.app.dbJson.areas.filter(area => area.cityCode === cityCode);
    res.send({
        code: constCode.OK,
        data:areas,
    });
});

router.get('/streets', function(req, res, next) {
    let areaCode = req.query.areaCode;
    let streets = req.app.dbJson.streets.filter(street => street.areaCode === areaCode);
    res.send({
        code: constCode.OK,
        data:streets,
    });
});


router.get('/tax_types', function (req, res) {
    res.send({
        code: constCode.OK,
        data:req.app.dbJson.taxTypes,
    });
});

router.get('/tz_types', function (req, res) {
    res.send({
        code: constCode.OK,
        data:req.app.dbJson.tzTypes,
    });
});

router.get('/operating_years', function (req, res) {
    res.send({
        code: constCode.OK,
        data:req.app.dbJson.operatingYears,
    });
});

router.get("/gs_types", function(req, resp){
    resp.send({
        code:constCode.OK,
        data:req.app.dbJson.gsTypes
    })
});

router.get("/gs_ziben", function(req, resp){
    resp.send({
        code:constCode.OK,
        data:req.app.dbJson.gsZiben
    })
});

router.get("/support_qq", function (req, resp) {
    let index = utils.random(req.app.dbJson.suportQq.length)
    resp.send({
        code:constCode.OK,
        data:req.app.dbJson.suportQq[index]
    })
});

router.get("/support_phone", function (req, resp) {
   let data = require("../dbjson/common");
   resp.send({
       code:constCode.OK,
       data:data.phone
   });
});

module.exports = router;