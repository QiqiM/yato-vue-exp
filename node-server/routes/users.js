const express = require('express');
const router = express.Router();
const gmLog = require("../utils/logger")("gm")
const daoUser = require("../dao/models/user")
const constCode = require("../consts/constCode")
const user = require('../ctrl/users')


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
 *              "username": username
 *              },
 *          "token" : "xxx"
 *      }
 *  }
 * @apiSampleRequest http://localhost:3000/user/login
 * @apiVersion 1.0.0
 */
router.post('/login', user.login);

/**
 * 
 * @api {post} /user/logOut
 * @apiDescription 用户登出
 * @apiName logOut
 * @apiGroup user
 * @apiSuccess {json} result
 * @apiSuccessExample {json} Success-Response:
 *  {
 *      "code" : "0",
 *  }
 * @apiSampleRequest http://localhost:3000/user/logOut
 * @apiVersion 1.0.0
 */
router.post('/logOut', user.logOut);

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
 *  }
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
 * {
 *      "username" : "yato"
 * }
 * @apiSampleRequest http://localhost:3000/user/info
 * @apiSuccessExample {type} Success-Response:
 * {
 *     code: 0
 *     data: {
 *        username: "yato",
 *        role: ["admin"],
 *        createTime: "2019-12-16T02:11:41.398Z",
 *        email: "test@qq.com"
 *     }
 * }
 * @apiErrorExample {type} Error-Response:
 *   {
 *     code: "errCode"
 *     msg: "errMsg"
 *   }
 */
router.get("/info", user.info)

/**
 * 
 * @api {post} /user/list
 * @apiDescription 获取用户列表
 * @apiName list
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiParam  {String} page_no   页数
 * @apiParam  {String} page_size 条数
 * @apiParam  {String} phone     电话号码
 * 
 * @apiSuccess {json} result
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *      "page_no" : 1，
 *      "page_size" : 5，
 *      "phone" : 95279527，  
 * }
 * @apiSampleRequest http://localhost:3000/user/list
 * @apiSuccessExample {type} Success-Response:
 * {
 *     code: 0
 *     data: {
 *        user: [user bject],
 *        total: 20
 *     }
 * }
 * @apiErrorExample {type} Error-Response:
 *   {
 *     code: "errCode"
 *     msg: "errMsg"
 *   }
 */
router.post('/list', user.list);

/**
 * 
 * @api {post} /user/update
 * @apiDescription 更新用户信息
 * @apiName update
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiParam  {String} password   密码
 * @apiParam  {String} phone     电话号码
 * @apiParam  {String} _id       唯一Id
 * 
 * @apiSuccess {json} result
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *      "_id":"5df6e7dd0943cf4778361e0c"
 *      "password" : 123，
 *      "phone" : 95279527，  
 * }
 * @apiSampleRequest http://localhost:3000/user/update
 * @apiSuccessExample {type} Success-Response:
 * {
 *     code: 0，
 *     msg: "更新成功"
 * }
 * @apiErrorExample {type} Error-Response:
 *   {
 *     code: "1"
 *     msg: "更新失败"
 *   }
 */
router.post('/update', user.update);

/**
 * 
 * @api {post} /user/remove
 * @apiDescription 删除用户
 * @apiName remove
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiParam  {String} _id       唯一Id
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *      "_id":"5df6e7dd0943cf4778361e0c"
 *      "password" : 123，
 *      "phone" : 95279527，  
 * }
 * @apiSampleRequest http://localhost:3000/user/remove
 * @apiSuccessExample {type} Success-Response:
 * {
 *     code: 0，
 *     msg: "删除成功"
 * }
 * @apiErrorExample {type} Error-Response:
 *   {
 *     code: "1"
 *     msg: "删除失败"
 *   }
 */
router.post('/remove', user.remove);

module.exports = router;
