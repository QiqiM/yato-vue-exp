const express = require('express');
const router = express.Router();
const gmLog = require("../utils/logger")("gm")
const appLog = require("../utils/logger")("app")
const wbAccount = require("../dao/mysql/tables/wb_account")
const constCode = require("../consts/constCode")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  gmLog.info("get index success!")
});

/* GET users listing. */
router.get('/list', function (req, res, next) {
  wbAccount.findAll(function (err, rows) {
    if (err) {
      appLog.error("db error on find all user ,stack:%j", err.stack);
      res.send({ code: constCode.FAIL });
      return;
    }

    res.send({
      code: constCode.OK,
      data: rows.map(row => {
        return {
          id: row.id,
          account_id: row.account_id,
          role: row.role
        }
      })
    });

    gmLog.info("query account success!")
  });
});

module.exports = router;
