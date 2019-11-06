const fs = require("fs");
const path = require("path");
const base_dir = path.join(__dirname, "../dbjson");
class ArrayFileStorage{
    constructor(filename){
        this.filename = filename;
        this.filePath = path.join(base_dir, filename);
        let data = fs.readFileSync(this.filePath);
        this.data = JSON.parse(data);
    }

    get length(){
        return this.data.length;
    }

    push(...args){
        this.data.push(...args);
        this.save();
    }

    pop(){
        return this.data.pop();
    }

    map(...args){
        return this.data.map(...args)
    }

    filter(...args){
        return this.data.filter(...args);
    }

    find(...args){
        return this.data.find(...args);
    }

    findIndex(...args){
        return this.data.findIndex(...args);
    }

    indexOf(arg){
        return this.data.findIndex(function (d) {
            if(typeof d === "object")
                return JSON.stringify(d) === JSON.stringify(arg);
            return arg === d;
        });
    }

    getAt(index){
        return this.data[index];
    }

    splice(index, num){
        let res = this.data.splice(index, num);
        this.save();
        return res;
    }

    save(){
        let str = JSON.stringify(this.data, null, 4);
        return fs.writeFileSync(this.filePath, str);
    }
}


module.exports = ArrayFileStorage;