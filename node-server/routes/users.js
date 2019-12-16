const express = require('express');
const router = express.Router();
const gmLog = require("../utils/logger")("gm")
const daoUser = require("../dao/models/user")
const constCode = require("../consts/constCode")
const user = require('../ctrl/users')

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

/**
 * 
 * @api {post} /user/login
 * @apiDescription 用户登录
 * @apiName login
 * @apiGroup user
 * @apiParam {string} username 用户名
 * @apiParam {string} password 密码
 * @apiParam {string} state 状态
 * @apiParam {string} email 邮箱
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *      "code" : "0",
 *      "data" : {
 *          "user" : {
 *                  "username": username
 *                },
 *          "token" : "xxx"
 *      }
 *  }
 * @apiSampleRequest http://localhost:3000/user/login
 * @apiVersion 1.0.0
 */
router.post('/login', user.login);

/**
 * 
 * @api {post} /user/register
 * @apiDescription 用户注册
 * @apiName register
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiParam  {String} username 用户名
 * @apiParam  {String} password 密码
 * @apiParam  {String} email 邮箱
 * @apiParam  {String} state 状态
 * @apiParam  {String} role 角色
 * 
 * @apiSuccess {json} result
 * 
 * @apiParamExample  {type} Request-Example:
 *  {
 *      "username" : "yato",
 *      "password" : "123456"
 *      "email" : "yato@qq.com"
 *      "state" : true
 *      "role" : "admin"
 * }
 * @apiSampleRequest http://localhost:3000/user/register
 * @apiSuccessExample {type} Success-Response:
 * {
 *     code: 0
 *     data: {}
 * }
 * 
 */
router.post('/register', user.register)

/**
 * 
 * @api {get} /user/info
 * @apiDescription 查找用户信息
 * @apiName info
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiParam  {String} username 用户名
 * 
 * @apiSuccess {json} result
 * 
 * @apiParamExample  {type} Request-Example:
 *  {
 *      "username" : "yato",
 * }
 * @apiSampleRequest http://localhost:3000/user/info
 * @apiSuccessExample {type} Success-Response:
 * {
 *     code: 0
 *     data: {
        username: "yato",
        role: ["admin"],
        createTime: "2019-12-16T02:11:41.398Z",
        email: "test@qq.com"
      }
 * }
 * 
 */
router.get("/info", function (req, res) {
  let username = req.query.username;

  daoUser.getModel().findOne({ username: username}, function (err, data) {
    if (!data) {
      gmLog.warn("not find user: %j", username);
      return res.send({ code: constCode.FAIL });
    }

    res.json({
      code: constCode.OK,
      data: {
        username: data.username,
        role: data.role,
        createTime: data.createTime,
        email: data.email
      }
    })
  })
})

module.exports = router;
