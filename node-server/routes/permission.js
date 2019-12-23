const express = require('express');
const router = express.Router();
const permission = require('../ctrl/permission')

/**
 * 
 * @api {post} /permission/add
 * @apiDescription 添加按钮
 * @apiName add
 * @apiGroup permission
 * @apiParam {string} code 唯一识别码
 * @apiParam {string} name 名字
 * @apiParam {string} desc 功能描述
 * @apiParam {Array} permission 权限
 * @apiSuccessExample {json} Success-Response:
 *  {
 *      "code" : "0",
 *      "data" : {
 *          "msg" : "添加成功"
 *      }
 *  }
 * @apiSampleRequest http://localhost:3000/permission/add
 * @apiVersion 1.0.0
 */
router.post('/add', permission.add);

/**
 * 
 * @api {post} /permission/list
 * @apiDescription 获取权限列表
 * @apiName list
 * @apiGroup permission
 * @apiVersion  1.0.0
 * @apiParam  {String} page_no   页数
 * @apiParam  {String} page_size 条数
 * 
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *      "page_no" : 1，
 *      "page_size" : 5
 * }
 * @apiSampleRequest http://localhost:3000/permission/list
 * @apiSuccessExample {type} Success-Response:
 * {
 *     code: 0
 *     data: {
 *        permission: [permission object],
 *        total: 20
 *     }
 * }
 * @apiErrorExample {type} Error-Response:
 *   {
 *     code: "errCode"
 *     msg: "errMsg"
 *   }
 */
router.post('/list', permission.list);

/**
 * 
 * @api {post} /permission/update
 * @apiDescription 更新权限信息
 * @apiName update
 * @apiGroup permission
 * @apiVersion  1.0.0
 * @apiParam  {String}  code        唯一标志码
 * @apiParam  {String}  name        名字
 * @apiParam  {Boolean} state       状态
 * @apiParam  {String}  _id         唯一Id
 * @apiParam  {String} desc         描述
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *      "_id":"5df6e7dd0943cf4778361e0c"
 *      "password" : 123，
 *      "phone" : 95279527，  
 * }
 * @apiSampleRequest http://localhost:3000/permission/update
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
router.post('/update', permission.update);

/**
 * 
 * @api {post} /permission/remove
 * @apiDescription 删除权限
 * @apiName remove
 * @apiGroup permission
 * @apiVersion  1.0.0
 * @apiParam  {String} _id       唯一Id
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *      "_id":"5df6e7dd0943cf4778361e0c"
 * }
 * @apiSampleRequest http://localhost:3000/permission/remove
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
router.post('/remove', permission.remove);

module.exports = router;
