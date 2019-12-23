const users = require("./users")
const button = require("./button")
const permission = require("./permission")
const role = require("./role")
const common = require("./common")

module.exports = function (app) {
  app.use("/", common);
  app.use("/user", users);
  app.use("/button", button);
  app.use("/role", role);
  app.use("/permission", permission);
};
