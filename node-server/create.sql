-- --------------------------------------------------------
-- 主机:                           localhost
-- 服务器版本:                        5.5.20-log - MySQL Community Server (GPL)
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  9.1.0.4867
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- create mysql user --
CREATE USER 'lobbybuy'@'localhost' identified by 'qing.me.2019';
grant all on buyenterprise.* to 'lobbybuy'@'localhost';


CREATE USER 'lobbybuy'@'%' identified by 'qing.me.2019';
grant all on buyenterprise.* to 'lobbybuy'@'%';


CREATE USER 'pomelobuy'@'%' identified by 'read.me.2019';
grant select on *.* to 'pomelobuy'@'%';

FLUSH PRIVILEGES;

-- 导出 account_db1 的数据库结构
DROP DATABASE IF EXISTS `buyenterprise`;
CREATE DATABASE IF NOT EXISTS `buyenterprise` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `buyenterprise`;



CREATE TABLE `enterprise` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`gs_name` VARCHAR(50) NOT NULL DEFAULT '',
	`gs_show_name` VARCHAR(50) NOT NULL DEFAULT '',
    `gs_show_legal_person` VARCHAR(50) NOT NULL DEFAULT '',
	`gs_price` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	`gs_type` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '广告传媒公司',
	`gs_create_time` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
	`gs_ziben` VARCHAR(30)  NOT NULL DEFAULT '',
	`gs_id_no` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '--统一社会信用码',
	`gs_locate` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '--"南京****",',
	`gs_state` VARCHAR(10) NOT NULL DEFAULT '' COMMENT '--经营状态',
	`gs_legal_person` VARCHAR(10) NOT NULL DEFAULT '' COMMENT '--"陈**", //法人',
	`gs_registration` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '--"南京工商行政管理局", //登记机关',
	`gs_reg_place` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '--"南京***",',
	`gs_desc` VARCHAR(200) NOT NULL DEFAULT '' COMMENT '--简要说明,',
	`gs_operating_project` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '-- 经营项目 "文化艺术交流活动策划；",',
	`sw_type` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '--"小规模类纳税人",//税务类型',
	`sw_ticket` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--:"万元版",//发票版本',
	`sw_bank` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '-- "工商银行",//开户银行',
	`sw_tax_status` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '-- "正常", //纳税情况',
	`sw_social_security_num` INT(11) NOT NULL DEFAULT '0' COMMENT '--社保人数',
	`sw_account_num` INT(11) NOT NULL DEFAULT '0' COMMENT '--一般账户',
	`sw_debt_num` INT(11) NOT NULL DEFAULT '0' COMMENT '--债务条数',
	`tz_type` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '-- "内资公司",',
	`tz_branch_office` INT(11) NOT NULL DEFAULT '0' COMMENT '--分支机构数',
	`tz_mortgage_guarantee_num` INT(11) NOT NULL DEFAULT '0' COMMENT '--抵押担保次数',
	`gs_operating_years` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '--经营年限',
	`tz_shareholder_num` INT(11) NOT NULL DEFAULT '0' COMMENT '--股东人数',
	`tz_credit_history_num` INT(11) NOT NULL DEFAULT '0' COMMENT '--信用记录条数',
	`tz_trade_type` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--"线上线下交易",//交易方式',
	`zc_knowledge` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '--知识产权',
	`zc_web` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--企业官网',
	`zc_wechat` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--微信公众号',
	`zc_patent` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--专利版权',
	`zc_online_shop` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--网店平台',
	`zc_spread` VARCHAR(20) NOT NULL DEFAULT '' COMMENT '--营销推广',
	`zc_other` VARCHAR(100) NOT NULL DEFAULT '' COMMENT '--其他资产,',
	`trade_status` SMALLINT(5) UNSIGNED NOT NULL DEFAULT '0' COMMENT '交易状态',
	`publish_time` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`)
)AUTO_INCREMENT=10000 COLLATE='utf8_general_ci' ENGINE=InnoDB;

CREATE TABLE `purchase` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`gs_type` VARCHAR(15) NOT NULL DEFAULT '' COMMENT '公司类型',
	`gs_operating_years` VARCHAR(15) NOT NULL DEFAULT '',
	`gs_ziben` VARCHAR(15) NOT NULL DEFAULT '',
	`sw_type` VARCHAR(15) NOT NULL DEFAULT '',
	`phone` VARCHAR(11) NOT NULL DEFAULT '',
	`show_phone` VARCHAR(11) NOT NULL DEFAULT '',
	`create_time` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
	`auth_time` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
	`uid` VARCHAR(32) NOT NULL DEFAULT '',
	`note` VARCHAR(200) NOT NULL DEFAULT '',
	`state` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

CREATE TABLE `sale` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`phone` VARCHAR(11) NOT NULL DEFAULT '',
	`uid` VARCHAR(32) NOT NULL DEFAULT '',
	`state` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	`note` VARCHAR(200) NOT NULL DEFAULT '',
	`sw_type` VARCHAR(32) NOT NULL DEFAULT '',
	`gs_name` VARCHAR(30) NOT NULL DEFAULT '',
	`gs_price` INT(11) NOT NULL DEFAULT '0',
	`gs_type` VARCHAR(30) NOT NULL DEFAULT '' COMMENT '经营类型',
	`create_time` BIGINT(20) UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=21;

CREATE TABLE `wb_account` (
    	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    	`account_id`  VARCHAR(15) NOT NULL DEFAULT '',
    	`password`  VARCHAR(32) NOT NULL DEFAULT '',
    	`role`  VARCHAR(15) NOT NULL DEFAULT '',
    	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=21;

CREATE TABLE `cooperation` (
    	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    	`phone`  VARCHAR(11) NOT NULL DEFAULT '',
    	`note`  VARCHAR(200) NOT NULL DEFAULT '',
    	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=21;