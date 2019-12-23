const gmLog = require("../utils/logger")("gm")
const appLog = require("../utils/logger")("app")
const daoRole = require("../dao/models/role")
const constCode = require("../consts/constCode")
const constType = require('../consts/constType')
const to = require('await-to-js').default;
const utils = require("../utils/utils");

module.exports = {
    add: async (req, res) => {
        let { body: param, body: { code } } = req;

        let err, role, newRole

        [err, role] = await to(daoRole.getModel().findOne({ code }));
        if (!!err)
            return utils.respErrorHandle(err, res);

        if (role) {
            return res.send({ code: constCode.FAIL, msg: '识别码已存在' });
        }

        [err, newRole] = await to(daoRole.getModel().create(param));
        if (!!err)
            return utils.respErrorHandle(err, res);

        if (newRole) {
            gmLog.info("add role: %j", newRole);
            return res.send({ code: constCode.OK, msg: '添加成功', data: newRole });
        }

        appLog.warn("db role create err!")
        res.status(422).send({ code: constCode.FAIL, msg: '添加失败', data: err.message });
    },
    list: async (req, res) => {
        let { page_no, page_size } = req.body;
        page_size = parseInt(page_size) < 1 ? 1 : parseInt(page_size);
        page_no = parseInt(page_no) < 1 ? 1 : parseInt(page_no);
        let err, result, total;

        [err, result] = await to(daoRole.getModel().find().
            skip((page_no - 1) * page_size).limit(page_size).sort({ timestamp: -1 }));

        if (!!err)
            return utils.respErrorHandle(err, res);

        [err, total] = await to(daoRole.getModel().countDocuments());

        if (!!err)
            return utils.respErrorHandle(err, res);

        gmLog.info("get role list success")
        res.json({
            code: constCode.OK,
            data: { item: result, total }
        })
    },
    update: async (req, res) => {
        let { body: param, body: { _id, code = '' } } = req
        if (!_id) {
            gmLog.debug("param error")
            return res.json({ code: constCode.FAIL, data: { msg: "请填写正确的id" } })
        }
        let err, role, upRole;

        if (!!code) {
            [err, role] = await to(daoRole.getModel().findOne({ code }));
            if (!!err)
                return utils.respErrorHandle(err, res);
        }

        if (role) {
            return res.send({ code: constCode.FAIL, msg: '识别码已存在,请换个识别码！' });
        }

        [err, upRole] = await to(daoRole.getModel().findOneAndUpdate({ _id }, param));

        if (!!err)
            return utils.respErrorHandle(err, res);

        if (!upRole)
            return res.json({ code: constCode.FAIL, data: { msg: "更新失败" } })


        gmLog.debug("update role: %j info success", _id)
        res.json({ code: constCode.OK, data: { msg: "更新成功" } })
    },
    remove: async (req, res) => {
        let _id = req.body._id
        if (!_id) {
            gmLog.debug("param error")
            return res.json({ code: constCode.FAIL, data: { msg: "请填写正确的id" } })
        }
        let deleteRole, err

        _id = utils.formatObjectId(_id);

        [err, deleteRole] = await to(daoRole.getModel().deleteOne({_id}))

        if (err)
            return utils.respErrorHandle(err, res);

        gmLog.debug(deleteRole)
        if (deleteRole.deletedCount === 1) {
            return res.json({ code: constCode.OK, data: { msg: "删除成功" } })
        } else {
            res.json({ code: constCode.FAIL, data: { msg: "删除失败" } })
        }
    }
}