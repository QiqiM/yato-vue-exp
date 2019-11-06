const wbAccount = require("../dao/mysql/tables/wb_account");
const utils = require("../utils/utils");
const appLog = require("../utils/logger").appLog;

class UserMgr{
    constructor(app){
        this.app = app;
    }

    createDefaultAdmin(){
        let defer = utils.defer();
        this._findUser("admin").then( data =>{
            if(!data || data.account_id !== "admin"){
                this.createUser("admin", "111111", "admin").then(res =>{
                    defer.resolve()
                });
            }else {
                defer.resolve()
            }
        });
        return defer.promise;
    }

    createUser(account, pwd, role){
        let defer = utils.defer();
        this.hasUser(account).then(has =>{
            if(has){
                defer.resolve(false);
                return;
            }
            wbAccount.insert({
                account_id:account,
                password: utils.encrypt(pwd),
                role:role
            },function (err) {
                if(err){
                    appLog.error("insert user db error, account:%j, pwd:%j", account, pwd);
                }
                defer.resolve(!err);
            });
        });
        return defer.promise;
    }

    async changePwd(account, pwd){
        let user = await this._findUser(account);
        if(!user) return false;
        let defer = utils.defer();
        wbAccount.updatePassword(account, utils.encrypt(pwd), function (err) {
            if(err){
                appLog.error("updatePassword db error, account:%j, pwd:%j", account, pwd);
            }
            defer.resolve(!!err);
        });
        return defer.promise;
    }

    async hasUser(account){
        return !! await this._findUser(account);
    }

    async auth(account, pwd){
        let user = await this._findUser(account);
        if(!user) return false;
        return user.password === utils.encrypt(pwd);
    }

    /**
     *
     * @param account
     * @returns {*|number|T}
     * @private
     */
    _findUser(account){
        let defer = utils.defer();
        wbAccount.find(account, function (err, rows) {
            if(err){
                appLog.error("db error on find user ,stack:%j", err.stack);
                defer.reject(err);
                return;
            }
            defer.resolve(rows[0]);
        });
        return defer.promise;
    }

    async getUserInfo(account){
        return await this._findUser(account);
    }

    getAllUser(){
        let defer = utils.defer();
        wbAccount.findAll(function (err, rows) {
            if(err){
                appLog.error("db error on find all user ,stack:%j", err.stack);
                defer.reject(err);
                return;
            }
            defer.resolve(rows);
        });
        return defer.promise;
    }
}


module.exports = UserMgr;