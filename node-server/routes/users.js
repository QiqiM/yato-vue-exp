const express = require('express');
const router = express.Router();
const gmLog = require("../utils/logger")("gm")
const appLog = require("../utils/logger")("app")
const daoUser = require("../dao/models/user")
const constCode = require("../consts/constCode")


/* GET users listing. */
router.get('/list', function (req, res, next) {
  daoUser.getModel().findAll(function (err, data) {
    res.send({
      code: constCode.OK,
      data: Object.keys(data).map(key => 
        ({
          username: data[key].username,
          password: data[key].password,
          email: data[key].email,
          role: data[key].role
        })
      )
    })
  })
});

router.post('/addUser', function (req, res, next) {
  let user = new daoUser.getModel()(req.body);
  gmLog.info("add user userInfo: %j", req.body);
  user.save(function(err,data){
    if(err){
      gmLog.warn("db user save err!")
      res.send({code: constCode.FAIL, data: err.message});
    }else{
      res.send({code: constCode.OK, data: data});
    }
  });
})

module.exports = router;
