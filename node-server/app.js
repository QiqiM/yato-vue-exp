const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParse = require('body-parser');
const jwt = require('express-jwt');

// const logger = require('morgan');
const appLogger = require("./utils/logger")("app");
const mysqlConfig = require("./config/mysql.json");
const mongodbConfig = require("./config/mongodb.json");
const mysql = require("./dao/mysql/index").mysql;
const mongodb = require("./dao/mongodb")
const routes = require('./routes/index')
const constType = require('./consts/constType')
const constCode = require('./consts/constCode')
const utils = require('./utils/utils')

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const app = express();

// 暂不使用
// mysql.init(mysqlConfig.mysql, function (err) {
//   if(err){
//     appLogger.error("mysql init error, stack:%j", err.stack);
//   }else
//     appLogger.info("mysql init success!");
// });

mongodb.initMongodbConns('business', mongodbConfig["business"])

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(bodyParse());

// parse application/x-www-form-urlencoded
app.use(bodyParse.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParse.json())

app.use(express.static(path.join(__dirname, 'public')));

app.use(jwt({ secret: constType.SECRET }).unless({
  path: [
    '/user/login',
    '/user/register',
    '/apidoc*'
  ]
}));

// 自定义token校验
// app.use(utils.checkAndRefreshToken)

// 跨域设置
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization,\'Origin\',Accept,X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('X-Powered-By', 'express 3.2.1');
  res.header('Content-Type', 'application/json;charset=utf-8');     // 设置了此项，模板引擎使用会有影响
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(async (req, res, next) => {
  let start = new Date()
  await next()
  let ms = new Date() - start
  appLogger.info(`${req.method} ${req.originalUrl} -- ${res.statusCode} - ${ms}ms`)
})

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
routes(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  appLogger.error("To 404 Error");
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  if (err.name === 'UnauthorizedError') {   
    //  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
    return res.status(401).send({code: constCode.LOGIN.AUTH_ERROR,msg:'invalid token'});
  }
  // render the error page
  res.status(err.status || 500);
  appLogger.error("path:%j", req.path);
  appLogger.error(err.stack);
  res.render('error');
});

process.on('uncaughtException', (err) => {
  appLogger.fatal('app Caught uncaught expception: ' + err.stack);
});

process.on('unhandledRejection', error => {
  appLogger.fatal('app Caught unhandledRejection', error.message || error.stack);
  // process.exit(1)  // To exit with a 'failure' code ,暂不退出
});

process.on('exit', (code) => {
  appLogger.warn('app exit with code: %d', code)
})

module.exports = app;
