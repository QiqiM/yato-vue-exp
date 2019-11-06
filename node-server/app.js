const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const logger = require('morgan');
const session = require("express-session");
const MemoryStore = require('memorystore')(session);
const multipart = require('connect-multiparty');
const createError = require('http-errors');
const DbJson = require("./modules/dbjson");
const appLogger = require("./utils/logger").appLog;
const indexRouter = require('./routes/index');
const configRouter = require("./routes/config");
const enterpriseRouter = require("./routes/enterpise");
const dbConfig = require("./config/db");
const mysql = require("./dao/mysql/index").mysql;
const usersRouter = require('./routes/user');
const permissionRouter = require("./routes/permission");
const authRouter = require("./routes/auth");
const app = express();



const ArrayFileStorage = require("./module/fileStorage");
const UserMgr = require("./ctrl/userMgr");
const Permission = require("./ctrl/permission");



app.set("role", new ArrayFileStorage("role.json"));
app.set("permission", new ArrayFileStorage("permission.json"));
app.userMgr = new UserMgr(app);
Permission.instance.init(app);


app.dbJson = new DbJson();
mysql.init(dbConfig.mysql, function (err) {
    if(err){
        appLogger.error("mysql init error, stack:%j", err.stack);
    }else
        app.userMgr.createDefaultAdmin().then(res =>{
            appLogger.info("mysql init success!");
        }).catch(err =>{
            appLogger.error("createDefaultAdmin error, stack:%j", err.stack);
        })
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 设置静态文件夹，将vue打包文件放在这里
app.use(express.static(path.join(__dirname, process.env.public_dir || "public")));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true  }));
app.use(multipart());
app.use(session({
    store: new MemoryStore({ checkPeriod: 86400000 }),
    resave: true,
    saveUninitialized: true,
    secret: 'uwotm8' }));

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,\'Origin\',Accept,X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('X-Powered-By', ' 3.2.1');
    res.header('Content-Type', 'application/json;charset=utf-8');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use('/', permissionRouter);
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/config', configRouter);
app.use('/enterprise', enterpriseRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    appLogger.error("path:%j",req.path);
    appLogger.error(err.stack);
    res.send(err.stack);
});

module.exports = app;
