const users = require("./users")
const common = require("./common")

module.exports = function (app){
  app.use("/",common);
  app.use("/user",users);
};
