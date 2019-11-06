const express = require('express');
const router = express.Router();
const Permission = require("../ctrl/permission");
const constCode = require("../consts/constCode");

router.get('/routes', Permission.requireLogin(), function(req, res, next) {
    let routes = Permission.instance.getAllRoutes();
    res.send({
        code: constCode.OK,
        data:routes
    });
});

router.get('/myroutes', Permission.requireLogin(), function (req, resp) {
    req.app.userMgr.getUserInfo(req.session.account).then(user =>{
        if(!user){
            resp.send({
                code: constCode.PERMISSION_DENIED,
                message: "请重新登录"
            });
            return;
        }
        let routes = Permission.instance.getRoutes(user.role);
        resp.send({
            code: constCode.OK,
            data:routes
        });
    }).catch(e =>{
        resp.send({
            code: constCode.FAIL,
            message:e.message
        });
    })

});

router.get('/roles',Permission.requireLogin(), function (req, resp) {
    let roles = Permission.instance.getAllRoles();
    resp.send({
        code: constCode.OK,
        data:roles
    });
});


/**
 * add role
 */
router.post('/role',Permission.requireLogin(), function (req, resp) {
    Permission.instance.addRole(req.body);
    resp.send({
        code:constCode.OK,
        data: {

            status: 'success'
        }
    })
});

router.put('/role/*',Permission.requireLogin(), function (req, resp) {
    Permission.instance.updateRole(req.body);
    resp.send({
        code:constCode.OK,
        data: {
            status: 'success'
        }
    });
});

router.delete("/role",Permission.requireLogin(), function (req, resp) {
    Permission.instance.deleteRole(req.body.key);
    resp.send({
        code:constCode.OK,
        data: {
            status: 'success'
        }
    });
});




module.exports = router;