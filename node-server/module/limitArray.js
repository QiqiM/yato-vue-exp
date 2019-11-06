class LimitArray{
    constructor(len){
        this.maxLen = len;
        this.data = [];
    }

    push(...args){
        this.data.push(...args);
        if(this.data.length > this.maxLen){
            this.data.splice(0, this.maxLen - this.data.length);
        }
    }

    map(...args){
        return this.data.map(...args);
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

    indexOf(...args){
        return this.data.indexOf(...args);
    }

    reduce(...args){
        return this.data.reduce(...args);
    }

    forEach(...args){
        return this.data.forEach(...args);
    }

    clear(){
        this.data.length = 0;
    }

    clone(){
        return [].concat(this.data);
    }

    get length(){
        return this.data.length;
    }

    set length(val){
        return this.data.length = val;
    }

}


module.exports = LimitArray;