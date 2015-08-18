require("source-map-support").install();
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

  'use strict';

  var mysql = __webpack_require__(2);
  var _ = __webpack_require__(1);

  var countAdd = function countAdd(prefix, arr) {
  	var separator = arguments.length <= 2 || arguments[2] === undefined ? ", " : arguments[2];

  	if (!arr.length) return '';
  	return (prefix ? prefix + ' ' : '') + arr.join(separator);
  };

  var strToArr = function strToArr(val) {
  	if (!val) return [];
  	if (!_.isArray(val)) return [val];
  	return val;
  };

  var quoteStr = function quoteStr(str) {
  	return _.isNumber(str) ? str : '"' + str + '"';
  };

  var objToSQLArr = function objToSQLArr(obj) {
  	var r = [];
  	for (var i in obj) {
  		if (_.isObject(obj[i]) || _.isArray(obj[i]) || _.isFunction(obj[i]) || _.isNaN(obj[i])) continue;
  		r.push(i + '=' + quoteStr(obj[i]));
  	}
  	return r;
  };

  module.exports = function (auth) {
  	var c = mysql.createConnection(auth);

  	var self = {};
  	self.connection = c;

  	self.end = function () {
  		c.end();
  		return self;
  	};

  	self.query = function (sql) {
  		var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  		c.query(sql, function (err, data) {
  			if (err) console.log(sql + " " + err);
  			if (callback) callback.apply(null, [data, err]);
  		});
  		return self;
  	};

  	self.insert = function (table, set) {
  		var callback = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  		if (_.isPlainObject(set)) set = objToSQLArr(set);
  		self.query(["INSERT INTO " + countAdd('', strToArr(table)), "SET " + countAdd('', strToArr(set))].join(" "), callback);
  		return self;
  	};

  	self['delete'] = function (table, where) {
  		var callback = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

  		if (_.isPlainObject(where)) where = objToSQLArr(where);
  		self.query(['DELETE FROM ' + countAdd('', strToArr(table)), countAdd('WHERE', strToArr(where), ' and ')].join(" "), callback);
  		return self;
  	};

  	self.select = function () {
  		var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  		var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  		var sql = [];
  		var attrs = {
  			cols: { head: 'SELECT', separator: ', ' },
  			from: { head: 'FROM', separator: ', ' },
  			where: { head: 'WHERE', separator: ' and ', obj: true },
  			group: { head: 'GROUP BY', separator: ', ' },
  			have: { head: 'HAVING', separator: ' and ' },
  			order: { head: 'ORDER BY', separator: ', ' },
  			limit: { head: 'LIMIT', separator: ', ' }
  		};

  		for (var i in attrs) {
  			if (!data[i]) continue;
  			if (attrs[i].obj && _.isPlainObject(data[i])) data[i] = objToSQLArr(data[i]);
  			var tmpVal = countAdd(attrs[i]['head'], strToArr(data[i]), attrs[i]['separator']);
  			if (tmpVal && tmpVal.length) sql.push(tmpVal);
  		}
  		self.query(sql.join(" "), callback);
  		return self;
  	};

  	self.update = self.set = function (table, set, where, callback) {
  		if (where === undefined) where = null;

  		if (_.isPlainObject(set)) set = objToSQLArr(set);
  		if (_.isPlainObject(where)) where = objToSQLArr(where);
  		var sql = ['UPDATE ' + countAdd('', strToArr(table)), 'SET ' + countAdd('', strToArr(set))];
  		if (where && where.length) sql.push(countAdd('WHERE', strToArr(where), ' and '));
  		self.query(sql.join(" "), callback);
  		return self;
  	};

  	return self;
  };

/***/ },
/* 1 */
/***/ function(module, exports) {

  module.exports = require("lodash");

/***/ },
/* 2 */
/***/ function(module, exports) {

  module.exports = require("mysql");

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map