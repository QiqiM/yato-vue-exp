const express = require('express');
const router = express.Router();
const constCode = require("../consts/constCode");
const Permission = require("../ctrl/permission");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/login",function (req, resp, next) {
    resp.send({ok:1});
});

router.post("/login",async function (req, resp, next) {
    let username = req.body.username;
    let password = req.body.password;
    let userMgr = req.app.userMgr;
    if(! await userMgr.auth(username, password)){
        resp.send({
            code: constCode.AUTH_ERROR,
            message: 'Account and password are incorrect.'
        });
        return;
    }
    req.session.account = username;
    resp.send({
        code: constCode.OK,
        data: username
    });
});

router.get("/info", function (req, resp) {
    req.app.userMgr.getUserInfo(req.session.account).then(userInfo =>{
        resp.send({
            code: constCode.OK,
            data: {
                roles: userInfo.role,
                introduction: 'I am a super administrator',
                avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
                name: 'Super Admin'}
        });
    }).catch(err =>{
        resp.send({code: constCode.FAIL});
    });
});

router.post("/logout", function (req, resp) {
    req.session.account = null;
    resp.send({
        code: constCode.OK
    });
});

router.put("/user", function (req, resp) {

    if(!req.body.accountId){
        resp.send({
            code: constCode.FAIL,
            message:"账号id为空"
        });
        return;
    }

    if(req.body.password !== req.body.rePassword){
        resp.send({
            code: constCode.FAIL,
            message:"重复密码不一致"
        });
        return;
    }

    req.app.userMgr.hasUser(req.body.accountId).then(has =>{
        if(has){
            resp.send({
                code: constCode.FAIL,
                message:"改账号已经存在"
            });
            return;
        }
        req.app.userMgr.createUser(req.body.accountId, req.body.password, req.body.role).then(res =>{
            if(res){
                resp.send({
                    code: constCode.OK
                });
            }else{
                resp.send({
                    code: constCode.FAIL
                });
            }
        }).catch(err=>{
            resp.send({
                code: constCode.FAIL,
                message: err.message
            });
        })
    });
});

router.get("/user_list", function (req, resp) {
    req.app.userMgr.getAllUser().then(res =>{
        resp.send({
            code: constCode.OK,
            data: res.map(user => ({accountId: user.account_id, role: user.role}))
        });
    }).catch(err=>{
        resp.send({
            code: constCode.FAIL,
            message: err.message
        });
    })
});

router.post("/change_password", Permission.requireLogin(), function (req, resp) {
    let username = req.session.account;
    let orgPassword = req.body.orgPassword;
    let newPassword = req.body.newPassword;
    let userMgr = req.app.userMgr;
    userMgr.auth(username, orgPassword).then(ok =>{
        if(!ok){
            resp.send({code: constCode.FAIL, message:"原密码错误！"});
            return;
        }
        userMgr.changePwd(username, newPassword).then(fail =>{
            resp.send({code: !fail ? constCode.OK : constCode.FAIL});
        });
    }).catch(e =>{
        resp.send({code: constCode.FAIL, message: e.message});
    })
});


module.exports = router;
