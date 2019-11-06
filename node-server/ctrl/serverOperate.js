const Permission = require("./permission");
const TaskMgr = require("./taskMgr");
const gmLog = require("../utils/logger").gmLog;
const appLog = require("../utils/logger").appLog;

class ServerOperate{
    constructor(app){
        this.app = app;
        //this.operateData = app.get("serverOperate");
        this.instanceData = app.get("instance");
        this.actionData = app.get("action");
        this.projectData = app.get("project");
        this.cacheOutStream = {};
    }

    addSchedule(account, cmd, instances, ctx, scheduleTime){
        let actions = this.getValidActions(account);
        let action = actions.find(act => act.cmd === cmd);
        if(!action){
            appLog.info("addSchedule error, permission not allowed. account:%j, cmd:%j, context:%j", account, cmd, ctx);
            return {code: 1};
        }
        let actionData = Object.assign({}, action);
        let taskId = this.app.taskMgr.addScheduleTask({ actionData, instances, ctx}, scheduleTime);
        gmLog.info("execOperate account:%j, cmd:%j, taskId:%j, context:%j", account, cmd, ctx);
        return { code: 0, taskId };
    }


    execOperate(account, cmd, instances, ctx = {}){
        let actions = this.getValidActions(account);
        let action = actions.find(act => act.cmd === cmd);
        if(!action) return {code: 1};
        let task = TaskMgr.createActionTask(Object.assign({}, action), instances, ctx);
        this.app.taskMgr.addTask(task);
        task.start();
        gmLog.info("execOperate account:%j, cmd:%j, taskId:%j, context:%j", account, cmd, task.id, ctx);
        return {code: 0, taskId: task.id}
    }


    /**
     * 获取有权限项目
     * @param account
     */
    getValidProjects(account){
        let checker = Permission.instance.getPermissionProjectIdChecker(account);
        return this.projectData.filter(p => checker(p.projectId));
    }

    /**
     * 获取有权限操作
     * @param account
     */
    getValidActions(account){
        let checker = Permission.instance.getPermissionActionChecker(account);
        return this.actionData.filter(p => checker(p.cmd));
    }

    /**
     * 获取有权限的实例
     * @param account
     */
    getValidInstances(account){
        let checker = Permission.instance.getPermissionProjectIdChecker(account);
        return this.instanceData.filter(d => checker(d.projectId));
    }

    /**
     * 更新Action 记录
     * @param data
     */
    upsertAction(data){
        if(!data.cmd || !Array.isArray(data.stepData)) return false;
        let index = this.actionData.findIndex(action => action.cmd === data.cmd);
        if(index > -1){
            this.actionData.splice(index, 1);
        }
        this.actionData.push(data);
        return true;
    }

    delAction(data){
        let index = this.actionData.findIndex(action => action.cmd === data.cmd);
        if(index > -1){
            this.actionData.splice(index, 1);
            return true;
        }
        return false;
    }
}


module.exports = ServerOperate;