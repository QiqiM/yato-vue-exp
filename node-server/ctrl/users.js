const gmLog = require("../utils/logger")("gm")
const appLog = require("../utils/logger")("app")
const daoUser = require("../dao/models/user")
const constCode = require("../consts/constCode")
const constType = require('../consts/constType')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const to = require('await-to-js').default;
const utils = require("../utils/utils");

module.exports = {
    register: async (req, res) => {
        if (!req.body.username || !req.body.password) {
            return res.send({ code: constCode.PARAM_ERROR });
        }

        let { body: param, body: { username, password } } = req
        let err, user, newUser

        [err, user] = await to(daoUser.getModel().findOne({ username }));
        if (!!err)
            return utils.respErrorHandle(err, res);

        if (user) {
            return res.send({ code: constCode.FAIL, msg: '用户名已存在' });
        }

        let cryrtpassword = bcrypt.hashSync(password, 8);
        param.password = cryrtpassword;

        [err, newUser] = await to(daoUser.getModel().create(param));
        if (!!err)
            return utils.respErrorHandle(err, res);

        if (newUser) {
            delete newUser._doc.password
            gmLog.info("add user userInfo: %j", newUser);
            return res.send({ code: constCode.OK, msg: '添加成功', data: newUser });
        }

        appLog.warn("db user create err!")
        res.status(422).send({ code: constCode.FAIL, msg: '添加失败', data: err.message });
    },
    login: async (req, res) => {
        let { username, password } = req.body

        if (!username || !password) {
            res.json({ code: constCode.PARAM_ERROR })
            return;
        }
        let err, user;

        [err, user] = await daoUser.getModel().findOne({ username }).lean()
        if (!!err)
            return utils.respErrorHandle(err, res);

        if (!user) {
            gmLog.warn("not find user: %j", username);
            return res.send({ code: constCode.FAIL, msg: '没有这个用户！' });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            res.json({ code: constCode.OK, msg: '密码错误！' })
            return;
        }

        let token = jwt.sign({ user }, constType.SECRET, { expiresIn: constType.TOKEN_EXPIRE });
        delete user.password

        res.json({
            code: constCode.OK,
            data: { user, token }
        })
    },
    info: async (req, res) => {
            let username = req.query.username;
            let err,user;

            [err,user] = await daoUser.getModel().findOne({ username }).lean();
            if (!!err)
                return utils.respErrorHandle(err, res);

            if (!user) {
                gmLog.warn("not find user: %j", username);
                return res.send({ code: constCode.FAIL, msg: '没有这个用户！' });
            }

            delete user.password

            res.json({
                code: constCode.OK,
                data: { user }
            })
    }
}