const gmLog = require("../utils/logger")("gm")
const appLog = require("../utils/logger")("app")
const daoButton = require("../dao/models/button")
const constCode = require("../consts/constCode")
const constType = require('../consts/constType')
const to = require('await-to-js').default;
const utils = require("../utils/utils");

module.exports = {
    add: async (req, res) => {
        let { body: param, body: { code } } = req;

        let err, button, newbutton

        [err, button] = await to(daoButton.getModel().findOne({ code }));
        if (!!err)
            return utils.respErrorHandle(err, res);

        if (button) {
            return res.send({ code: constCode.FAIL, msg: '识别码已存在' });
        }

        [err, newbutton] = await to(daoButton.getModel().create(param));
        if (!!err)
            return utils.respErrorHandle(err, res);

        if (newbutton) {
            gmLog.info("add button: %j", newbutton);
            return res.send({ code: constCode.OK, msg: '添加成功', data: newbutton });
        }

        appLog.warn("db button create err!")
        res.status(422).send({ code: constCode.FAIL, msg: '添加失败', data: err.message });
    },
    list: async (req, res) => {
        let { page_no, page_size } = req.body;
        page_size = parseInt(page_size) < 1 ? 1 : parseInt(page_size);
        page_no = parseInt(page_no) < 1 ? 1 : parseInt(page_no);
        let err, result, total;

        [err, result] = await to(daoButton.getModel().find().
            skip((page_no - 1) * page_size).limit(page_size).sort({ timestamp: -1 }));

        if (!!err)
            return utils.respErrorHandle(err, res);

        [err, total] = await to(daoButton.getModel().countDocuments());

        if (!!err)
            return utils.respErrorHandle(err, res);

        gmLog.info("get button list success")
        res.json({
            code: constCode.OK,
            data: { items: result, total }
        })
    },
    update: async (req, res) => {
        let { body: param, body: { _id, code = '' } } = req
        if (!_id) {
            gmLog.debug("param error")
            return res.json({ code: constCode.FAIL, data: { msg: "请填写正确的id" } })
        }
        let err, button, upButton;

        if (!!code) {
            [err, button] = await to(daoButton.getModel().findOne({ code }));
            if (!!err)
                return utils.respErrorHandle(err, res);
        }

        if (button) {
            return res.send({ code: constCode.FAIL, msg: '识别码已存在,请换个识别码！' });
        }

        [err, upButton] = await to(daoButton.getModel().findOneAndUpdate({ _id }, param));

        if (!!err)
            return utils.respErrorHandle(err, res);

        if (!upButton)
            return res.json({ code: constCode.FAIL, data: { msg: "更新失败" } })


        gmLog.debug("update button: %j info success", _id)
        res.json({ code: constCode.OK, data: { msg: "更新成功" } })
    },
    remove: async (req, res) => {
        let _id = req.body._id
        if (!_id) {
            gmLog.debug("param error")
            return res.json({ code: constCode.FAIL, data: { msg: "请填写正确的id" } })
        }
        let deleteButton, err

        _id = utils.formatObjectId(_id);

        [err, deleteButton] = await to(daoButton.getModel().deleteOne({_id}))

        if (err)
            return utils.respErrorHandle(err, res);

        gmLog.debug(deleteButton)
        if (deleteButton.deletedCount === 1) {
            return res.json({ code: constCode.OK, data: { msg: "删除成功" } })
        } else {
            res.json({ code: constCode.FAIL, data: { msg: "删除失败" } })
        }
    }
}