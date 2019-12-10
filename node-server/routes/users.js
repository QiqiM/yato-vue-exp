const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();
const gmLog = require("../utils/logger")("gm")
const appLog = require("../utils/logger")("app")
const daoUser = require("../dao/models/user")
const constCode = require("../consts/constCode")
const constType = require('../consts/constType')


/* GET users listing. */
router.get('/list', function (req, res) {
  daoUser.getModel().find({}, function (err, data) {
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

router.post('/login', function (req, res) {
  let username = req.body.username
  let password = req.body.password

  if (!username || !password) {
    res.json({ code: constCode.PARAM_ERROR })
    return;
  }

  daoUser.getModel().findOne({ username: username}, function (err, data) {
    if (!data) {
      gmLog.warn("not find user: %j", username);
      return res.send({ code: constCode.FAIL });
    }

    if(!bcrypt.compareSync(password, data.password)){
      res.json({success: false, message: '密码错误！'})
      return;
     }

    let token = jwt.sign({ user: data }, constType.SECRET, { expiresIn: constType.TOKEN_EXPIRE });

    res.json({
      code: constCode.OK,
      user: data,
      token: token
    })
  })
});

router.post('/register', function (req, res) {
  if(!req.body.username || !req.body.password){
    return res.send({ code: constCode.PARAM_ERROR});
  }

  let password = bcrypt.hashSync(req.body.password, 8);
  let info = {
    username: req.body.username || "",
    password: password,
    email: req.body.email || "",
    role: req.body.role || "",
  };

  let user = new daoUser.getModel()(info);
  gmLog.info("add user userInfo: %j", req.body);
  user.save(function (err, data) {
    if (err) {
      appLog.warn("db user save err!")
      res.status(422).send({ code: constCode.FAIL, data: err.message });
    } else {
      res.send({ code: constCode.OK, data: data });
    }
  });
})

router.get("/profile", function (req, res) {
  let username = req.query.username;

  daoUser.getModel().findOne({ username: username}, function (err, data) {
    if (!data) {
      gmLog.warn("not find user: %j", username);
      return res.send({ code: constCode.FAIL });
    }

    res.json({
      code: constCode.OK,
      user: data
    })
  })
})

router.get("/testToken", function (req, res) {
  res.json({
    code: constCode.OK,
    user: "data"
  })
})

module.exports = router;
