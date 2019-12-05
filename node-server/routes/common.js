const express = require('express');
const router = express.Router();
const gmLog = require("../utils/logger")("gm")


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  gmLog.info("get index success!")
});

module.exports = router;