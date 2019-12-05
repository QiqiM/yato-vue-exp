/**
 * Created by zwp on 2015/10/7.
 */

const logger          = require("../../../utils/logger")("app");
const constData       = require('./constData');

const exp = module.exports;

/**
 * sub string between
 */
exp.subStrBetween = function(strSql, beginStr, endStr, trim){
    try {
        trim = trim || true;
        let strTemp = strSql.toLowerCase();
        beginStr = beginStr.toLowerCase();
        endStr = endStr.toLowerCase();
        let bIndex = strTemp.indexOf(beginStr);
        if (-1 === bIndex)
            return null;

        bIndex = bIndex + beginStr.length;
        let eIndex = strSql.indexOf(endStr);
        if (-1 === eIndex)
            return null;

        if (trim){
            return strSql.substring(bIndex, eIndex).trim();
        }else{
            return strSql.substring(bIndex, eIndex);
        }
    } catch(err) {
        logger.error('rdbShard try catch!!! subStrBetween:%j', err.message);
        return null;
    }
};

/**
 * get virtual table name
 */
exp.getVirtualTableName = function(strSql){
    try {
        let tbName = null;
        let sqlToken = strSql.split(/\s+/, 1)[0];
        sqlToken = sqlToken.toLowerCase();
        switch (sqlToken){
            case constData.SQL_TOKEN.SELECT:{
                tbName = exp.subStrBetween(strSql, constData.SQL_TOKEN.FROM, constData.SQL_TOKEN.WHERE);
            }break;
            case constData.SQL_TOKEN.INSERT:{
                tbName = exp.subStrBetween(strSql, constData.SQL_TOKEN.INTO, constData.SQL_TOKEN.LPAREN) || exp.subStrBetween(strSql, constData.SQL_TOKEN.INSERT, constData.SQL_TOKEN.LPAREN);
            }break;
            case constData.SQL_TOKEN.UPDATE:{
                tbName = exp.subStrBetween(strSql, constData.SQL_TOKEN.UPDATE, constData.SQL_TOKEN.SET);
            }break;
            case constData.SQL_TOKEN.DELETE:{
                tbName = exp.subStrBetween(strSql, constData.SQL_TOKEN.FROM, constData.SQL_TOKEN.WHERE);
            }break;
            default:{
                logger.error('rdbShard error!!! getVirtualTableName, not parser sql, SQL-->%j', strSql);
            }break;
        }
        return tbName;
    } catch(err) {
        logger.error('rdbShard try catch!!! getVirtualTableName:%j, SQL-->%j', err.message, strSql);
        return null;
    }
};



