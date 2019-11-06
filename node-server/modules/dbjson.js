const fs = require("fs");
const path = require("path");
const cities = require("../dbjson/cities");
const operatingYears = require("../dbjson/operatingYears");
const provinces = require("../dbjson/provinces");
const streets = require("../dbjson/streets");
const taxTypes = require("../dbjson/taxTypes");
const tzTypes = require("../dbjson/tzTypes");
const areas = require("../dbjson/areas");
const gsTypes = require("../dbjson/gsTypes");
const gsZiben = require("../dbjson/gsZiben");
const suportQq = require("../dbjson/suportQq");

class DbJson {
    constructor(){
        this.baseDir = path.join(__dirname, "../dbjson");
        this.data = {};
        this.set("cities", cities);
        this.set("operatingYears", operatingYears);
        this.set("provinces", provinces);
        this.set("streets", streets);
        this.set("taxTypes", taxTypes);
        this.set("tzTypes", tzTypes);
        this.set("areas", areas);
        this.set("gsTypes", gsTypes);
        this.set("gsZiben", gsZiben);
        this.set("suportQq", suportQq);
    }

    set(name, val){
        this.data[name] = val;
    }

    get(name){
        return this.data[name];
    }

    get gsTypes(){
        return this.data["gsTypes"];
    }

    get gsZiben(){
        return this.data["gsZiben"];
    }

    get cities(){
        return this.data["cities"];
    }

    get operatingYears(){
        return this.data["operatingYears"];
    }

    get provinces(){
        return this.data["provinces"];
    }

    get areas(){
        return this.data["areas"];
    }
    get streets(){
        return this.data["streets"];
    }

    get taxTypes(){
        return this.data["taxTypes"];
    }

    get tzTypes(){
        return this.data["tzTypes"];
    }

    get suportQq(){
        return this.data["suportQq"];
    }
}


module.exports = DbJson;