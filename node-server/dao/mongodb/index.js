const logger = require('../../utils/logger')("app");
const mongoose = require('mongoose');

mongoose.plugin(schema => {
    schema.options.usePushEach = true;
    schema.options.autoIndex = false;
});

mongoose.Promise = global.Promise;      // Promise for mongoose

// mongodb manger
let __mapMongodbConns = {};

let initMongodbConns = function (type, config) {
    let mongodbConn = getMongodbConn(type)

    if (mongodbConn.readyState !== mongoose.Connection.STATES.disconnected) {
        logger.error('initMongodbConns type: %s had init', type);
        return;
    }

    let connCfg = config.mongoConns;
    if (!config) {
        let connsCfg = config.mongoConns.split(',');
        let rInx = Math.floor(Math.random() * connsCfg.length);
        connCfg = connsCfg[rInx];
    }

    // gen uris
    let uris = 'mongodb://' + config.user + ":" + config.password + '@'
        + connCfg + '/' + config.database + '?authMechanism=SCRAM-SHA-1';

    if (!!config.rs) {
        uris = uris + '&replicaSet=' + config.rs;
    }

    // set options
    let options = {
        // reconnectTries: Number.MAX_VALUE,   // old
        // reconnectInterval: 5000,            // old
        useUnifiedTopology: true,     // new version
        useNewUrlParser: true,           // new version
        useUnifiedTopology: true,
        // config:{autoIndex: false},
        promiseLibrary: global.Promise,  // promise for underlying mongodb driver
        // useMongoClient: true          // 5.x不是必须的
    };

    mongodbConn.openUri(uris, options, function (err) {
        if (err) {
            logger.fatal('mongodb type :%s connect error:%j', type, err.message);
            return;
        }

        logger.info('mongodb type:%s connect success!!!',type)
    });

    mongodbConn.on('error',function(err){
        logger.error('mongodb type :%s connect error:%j', type, err.message);
    });

    mongodbConn.on('connect',function(err){
        logger.error('mongodb type :%s connected !!! ', type);
    });

    mongodbConn.on('disconnected',function(err){
        logger.error('mongodb type :%s disconnected !!! ', type);
    });
}

let getMongodbConn = function(type){
    let mongodbConn = __mapMongodbConns[type];
    if(!mongodbConn){
        mongodbConn = mongoose.createConnection();
        mongodbConn.dbType = type;
        __mapMongodbConns[type] = mongodbConn;
        logger.info('getMongodbConn type:%s create connection',type);
    }

    return mongodbConn;
}

module.exports = {
    initMongodbConns:initMongodbConns,
    getMongodbConn: getMongodbConn,
    mongoose:mongoose
}