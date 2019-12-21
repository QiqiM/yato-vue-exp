const express = require('express');
const router = express.Router();
const button = require('../ctrl/button')

/**
 * 
 * @api {post} /button/add
 * @apiDescription 添加按钮
 * @apiName add
 * @apiGroup button
 * @apiParam {string} code 唯一识别码
 * @apiParam {string} name 名字
 * @apiParam {string} desc 功能描述
 * @apiSuccessExample {json} Success-Response:
 *  {
 *      "code" : "0",
 *      "data" : {
 *          "msg" : "添加成功"
 *      }
 *  }
 * @apiSampleRequest http://localhost:3000/button/add
 * @apiVersion 1.0.0
 */
router.post('/add', button.add);

/**
 * 
 * @api {post} /button/list
 * @apiDescription 获取按钮列表
 * @apiName list
 * @apiGroup button
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
 * @apiSampleRequest http://localhost:3000/button/list
 * @apiSuccessExample {type} Success-Response:
 * {
 *     code: 0
 *     data: {
 *        button: [button object],
 *        total: 20
 *     }
 * }
 * @apiErrorExample {type} Error-Response:
 *   {
 *     code: "errCode"
 *     msg: "errMsg"
 *   }
 */
router.post('/list', button.list);

/**
 * 
 * @api {post} /button/update
 * @apiDescription 更新按钮信息
 * @apiName update
 * @apiGroup button
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
 * @apiSampleRequest http://localhost:3000/button/update
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
router.post('/update', button.update);

/**
 * 
 * @api {post} /button/remove
 * @apiDescription 删除按钮
 * @apiName remove
 * @apiGroup button
 * @apiVersion  1.0.0
 * @apiParam  {String} _id       唯一Id
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *      "_id":"5df6e7dd0943cf4778361e0c"
 * }
 * @apiSampleRequest http://localhost:3000/button/remove
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
router.post('/remove', button.remove);

module.exports = router;
