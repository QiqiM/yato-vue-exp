/**
 * Created by Administrator on 2016/10/15.
 */

var MultiDatabase = require("./lib/multiDatabase");
var Database = require("./lib/database");

module.exports = {
    mysql: new MultiDatabase()
};
