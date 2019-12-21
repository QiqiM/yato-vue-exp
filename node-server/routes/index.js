const users = require("./users")
const button = require("./button")
const common = require("./common")

module.exports = function (app) {
  app.use("/", common);
  app.use("/user", users);
  app.use("/button", button);
};
