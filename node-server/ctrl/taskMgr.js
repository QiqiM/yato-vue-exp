const ArrayFileStorage = require("../module/fileStorage");
const LimitArray = require("../module/limitArray");
const childProcess = require("child_process");
const async = require("async");
const ActionTask = require("../module/actions/actionTask");
const utils = require("../utils/utils");

const TASK_TYPE = {
    ACTION: 1,
};

const SCHEDULE_TYPE = {
    TIMEOUT: 1
};

const LoopTick = 10000;

class TaskMgr{
    constructor(app){
        this.app = app;
        this.data = new ArrayFileStorage("task.json");
        this.scheduleData = new ArrayFileStorage("schedule.json");
        this.tasks = [];
        this.timer = setInterval(() => this.__scheduleTick(), LoopTick);
    }

    getTask(taskId){
        return this.tasks.find(task=>task.id === taskId);
    }

    getTaskStatus(taskId){
        let task = this.getTask(taskId);
        if(task){
            return task.getStatus();
        }
        return null;
    }

    addScheduleTask(task, schedule, type = SCHEDULE_TYPE.TIMEOUT){
        let scheduleTask = {
            id: utils.genTimeId(),
            type: type,
            task: task,
            schedule: schedule
        };
        this.scheduleData.push(scheduleTask);
        return scheduleTask.id;
    }

    __scheduleTick(){
        for(let i =0; i < this.scheduleData.length; ){
            let scheduleTask = this.scheduleData.getAt(i);
            let schedule = scheduleTask.schedule;
            if(isTimeout(schedule, scheduleTask.type)){
                let task = TaskMgr.createActionTask(scheduleTask.task.actionData, scheduleTask.task.instances, scheduleTask.task.ctx);
                task.start();
                this.addTask(task);
                this.scheduleData.splice(i, 1);
            }else {
                i++
            }
        }

        function isTimeout(schedule, type){
            let t = utils.formatTime(schedule.ymd, schedule.hms);
            return Date.now() > t;
        }
    }

    getScheduleTask(){
        return this.scheduleData.map(e => e);
    }

    deleteScheduleTask(id){
        let index = this.scheduleData.findIndex(t => t.id === id);
        if(index > -1){
            this.scheduleData.splice(index, 1);
            return true;
        }
        return false;
    }

    addTask(task){
        if(this.tasks.length > 200){
            this.clearTask();
        }
        this.tasks.push(task);
    }

    clearTask(){
        this.tasks = this.tasks.filter(task => task.isExpire())
    }

    getTypeTasks(){

    }

    clientHandle(opts){
        let task = this.getTask(opts.taskId);
        if(task) task.handleClient(opts);
    }

    static createActionTask(actionData, instances, ctx){
        return new ActionTask(actionData, instances, ctx)
    }
}


module.exports = TaskMgr;