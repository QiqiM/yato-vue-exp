/**
 * Created by Administrator on 2016/10/15.
 */

const MultiDatabase = require("./lib/multiDatabase");
const Database = require("./lib/database");

module.exports = {
    mysql: new MultiDatabase()
};
