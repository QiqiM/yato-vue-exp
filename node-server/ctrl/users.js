const gmLog = require("../utils/logger")("gm")
const appLog = require("../utils/logger")("app")
const daoUser = require("../dao/models/user")
const daoRole = require("../dao/models/role")
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

        [err, user] = await to(daoUser.getModel().findOne({ username }).lean())
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

        let token = jwt.sign({ username: user.username }, constType.SECRET, { expiresIn: constType.TOKEN_EXPIRE });
        delete user.password

        res.json({
            code: constCode.OK,
            data: { user, token }
        })
    },
    logOut: async (req, res) => {
        res.json({
            code: constCode.OK,
        })
    },
    getUserInfo: async (req, res) => {
        let _id = req.query._id;
        let err, user;

        [err, user] = await to(daoUser.getModel().findOne({ _id }).lean());
        if (!!err)
            return utils.respErrorHandle(err, res);

        if (!user) {
            gmLog.warn("not find user id: %j", _id);
            return res.send({ code: constCode.FAIL, msg: '没有这个用户！' });
        }

        delete user.password

        let per;
        [err,per] = await to(daoRole.getModel().findOne({'code':user.role[0]},'permissions'));
        // gmLog.info("per info:%j",per)

        res.json({
            code: constCode.OK,
            data: { 
                roles: user.role,
                permissions:per.permissions,
                avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
                name: user.username,
             }
        })
    },
    list: async (req, res) => {
        let { page_no, page_size, phone } = req.body;
        page_size = parseInt(page_size) < 1 ? 1 : parseInt(page_size);
        page_no = parseInt(page_no) < 1 ? 1 : parseInt(page_no);
        let err, result, total;
        let where = {}
        if (phone) {
            where.phone = phone
        }

        [err, result] = await to(daoUser.getModel().find(where, { password: 0 }).
            skip((page_no - 1) * page_size).limit(page_size).sort({ timestamp: -1 }));

        if (!!err)
            return utils.respErrorHandle(err, res);

        [err, total] = await to(daoUser.getModel().countDocuments(where));

        // 回调的写法
        // mongodb版本低于3.4会报错，版本太低，不支持collation [Server 127.0.0.1:27017, which reports wire version 3, does not support collation]
        // daoUser.getModel().testCount({},(err,data)=>{
        //     if(err)
        //         gmLog.error("=========err:%j",err.message)
        //     gmLog.debug("=========data:%j",data)
        // });

        if (!!err)
            return utils.respErrorHandle(err, res);

        res.json({
            code: constCode.OK,
            data: { items: result, total }
        })
    },
    update: async (req, res) => {
        let { body: param, body: { _id } } = req
        if (!_id) {
            gmLog.debug("param error")
            return res.json({ code: constCode.FAIL, data: { msg: "请填写正确的uid" } })
        }

        if (param.password !== '') {
            let cryrtpassword = bcrypt.hashSync(param.password, 8);
            param.password = cryrtpassword;
        } else if (param.password == '') {
            delete param.password;
        }

        let err, upUser;

        [err, upUser] = await to(daoUser.getModel().findOneAndUpdate({ _id }, param));

        if (!!err)
            return utils.respErrorHandle(err, res);

        if (!upUser)
            return res.json({ code: constCode.FAIL, data: { msg: "更新失败" } })


        gmLog.debug("update user: %j info success", _id)
        res.json({ code: constCode.OK, data: { msg: "更新成功" } })
    },
    remove: async (req, res) => {
        let _id = req.body._id
        if (!_id) {
            gmLog.debug("param error")
            return res.json({ code: constCode.FAIL, data: { msg: "请填写正确的uid" } })
        }
        let deleteUser, err
        _id = utils.formatObjectId(_id);

        [err, deleteUser] = await to(daoUser.getModel().deleteOne({ _id }))
        if (err)
            return utils.respErrorHandle(err, res);

        gmLog.debug(deleteUser)
        if (deleteUser.deletedCount === 1) {
            return res.json({ code: constCode.OK, data: { msg: "删除成功" } })
        } else {
            res.json({ code: constCode.FAIL, data: { msg: "删除失败" } })
        }
    }
}