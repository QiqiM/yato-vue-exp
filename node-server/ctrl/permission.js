const constOpPermission = require("../consts/constOpPermission");
const roles_default = require("../consts/constRoutes").roles_default;
const asyncRoutes = require("../consts/constRoutes").asyncRoutes;
const appLog = require("../utils/logger").appLog;
const constCode = require("../consts/constCode");

class SinglePermissionChecker{
    constructor(op){
        this.op = op;
    }

    hasPermission(permission){
        return permission.indexOf(this.op) > -1;
    }
}

class MultiPermissionChecker{
    constructor(...args){
        this.ops = args;
    }

    hasPermission(permission){
        return permission.findIndex(p =>{
            return this.ops.indexOf(p) > -1;
        }) > -1;
    }
}

const adminChecker = function () {
    return true;
};


class Permission{
    constructor(){
        this.app = null;
        this.permissionData = [];
        this.roleData = [];
    }

    init(app){
        this.app = app;
        this.permissionData = this.app.get("permission");
        this.roleData = this.app.get("role");
        if(this.roleData.length === 0){
            this.roleData.push(...roles_default);
        }
    }


    /**
     * 拥有权限的项目Id
     * @param account
     * @returns {Array}
     */
    getPermissionProjectIdChecker(account){
        let permission = this._findUser(account);
        const normalChecker = function (projectId) {
            return permission && permission.projects.indexOf(projectId) > -1;
        };
        if(account === 'admin'){
            return adminChecker;
        }
        return normalChecker;
    }


    /**
     * 获取有权限的操作
     * @param account
     * @returns {*}
     */
    getPermissionActionChecker(account){
        let permission = this._findUser(account);
        const normalChecker = function (actionCmd) {
            return permission && permission.actions.indexOf(actionCmd) > -1;
        };
        if(account === 'admin'){
            return adminChecker;
        }
        return normalChecker;
    }

    /**
     *
     * @param account
     * @returns {T | undefined}
     * @private
     */
    _findUser(account){
        return this.permissionData.find(function(user){
            return user.account === account;
        });
    }

    _findRole(key){
        return this.roleData.find(role =>role.key === key);
    }

    getRoutes(roleName){
        let data = this.roleData.find(role =>role.name === roleName);
        if(!data){
            return [];
        }
        return  data.routes;
    }

    _formatRole(role) {
        return Object.assign({}, role);
    }

    getAllRoles(){
        return this.roleData.map(this._formatRole);
    }

    /**
     *
     * @returns {*[]}
     */
    getAllRoutes(){
        return asyncRoutes;
    }

    addRole(role){
        if(this._findRole(role.key)){
            return false;
        }
        this.roleData.push(role);
        return true;
    }

    updateRole(role){
        let data = this._findRole(role.key);
        data.name = role.name;
        data.description = role.description;
        data.routes = role.routes;
        this.roleData.save();
    }

    deleteRole(key){
        let index = this.roleData.findIndex(role => role.key === key);
        if(index > -1){
            this.roleData.splice(index, 1);
        }
        return index > -1;
    }

    static get instance(){
        return _instance;
    }

    static requirePermissionRoute(...args){
        let checker;
        if(args.length > 1){
            checker = new MultiPermissionChecker(...args);
        }else{
            checker = new SinglePermissionChecker(args[0]);
        }
        return function (req, resp, next) {
            const self = Permission.instance;
            let account = req.session.account;
            let data = self.permissionData.find(function (p) {
                return p.account === account;
            });
            if (!data || !checker.hasPermission(data.permission)) {
                resp.send({code: 50002, msg: "permission denied"});
                return;
            }
            next();
        };
    }

    static requirePermissionAction(...args){
        let checker;
        if(args.length > 1){
            checker = new MultiPermissionChecker(...args);
        }else{
            checker = new SinglePermissionChecker(args[0]);
        }
        return function (req, resp, next) {
            const self = Permission.instance;
            let account = req.session.account;
            let data = self.permissionData.find(function (p) {
                return p.account === account;
            });
            if (!data || !checker.hasPermission(data.actions)) {
                resp.send({code: 50002, msg: "permission denied"});
                return;
            }
            next();
        };
    }


    static asyncRequireAction(actionGetter){
        if(typeof actionGetter === "string"){
            return this.requirePermissionAction(actionGetter);
        }
        return function (req, resp, next) {
            let actions = actionGetter(req);
            let handle = Permission.requirePermissionAction(...actions);
            handle(req, resp, next);
        }
    }

    static parseActionGetter(g){
        let routes = g.split(".");
        if(routes.length === 0) throw new Error("parseActionGetter error!");
        return function (req) {
            let d = req;
            try{
                for(let i =0; i < routes.length; i++){
                    d = d[routes[i]];
                }
            }catch (e) {
                appLog.error("parseActionGetter error, %j", e.stack);
                return void 0;
            }
            return d;
        }
    }

    static requireLogin(){
        return function (req, resp, next) {
            if(!req.session.account){
                resp.send({code:constCode.PERMISSION_DENIED})
                return;
            }
            next();
        }
    }
}

const _instance = new Permission();

module.exports = Permission;