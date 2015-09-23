var mysql = require('mysql');
var _ = require('lodash');

var countAdd = function(prefix,arr,separator=", "){
	if(!arr.length) return '';
	return (prefix ? prefix+' ' : '')+arr.join(separator);
}

var strToArr = function(val){
	if(!val) return [];
	if(!_.isArray(val)) return [val];
	return val;
}

var mysqlEscapeUnquoted = function(val){
	return mysql.escape(val).slice(0,-1).substr(1)
}

var objToSQLArr = function(obj){
	var r = [];
	for(var i in obj){
		if(_.isObject(obj[i]) || _.isArray(obj[i]) || _.isFunction(obj[i]) || _.isNaN(obj[i])) continue;
		r.push(mysqlEscapeUnquoted(i)+'='+mysql.escape(obj[i]));
	}
	return r;
}


module.exports = function(auth){
	var c = mysql.createConnection(auth);

	var self = {};
	self.connection = c;

	self.end = function(){
		c.end();
		return self;
	}

	self.escape = mysql.escape;

	self.query = function(sql,callback=null,options=null){

		c.query((options ? _.extend({},{sql:sql},options) : sql),function(err,data){
			if(err || (options && options.debug)) console.log(sql+" "+err);
			if(callback) callback.apply(null,[err,data]);
		});
		return self;
	}

	self.insert = function(table,set,callback=null,options=null){
		if(_.isPlainObject(set)) set = objToSQLArr(set);
		self.query([
			"INSERT INTO "+countAdd('',strToArr(table)),
			"SET "+countAdd('',strToArr(set))
		].join(" "),callback,options);
		return self;
	}

	self.delete = function(table,where,callback=null,options=null){
		if(_.isPlainObject(where)) where = objToSQLArr(where);
		self.query([
			'DELETE FROM '+countAdd('',strToArr(table)),
			countAdd('WHERE',strToArr(where),' and ')
		].join(" "),callback,options);
		return self;
	}


	self.select = function(data={},callback=null,options=null){
		var sql=[];
		var reqCols;
		var attrs = {
			cols:{head:'SELECT',separator:', '},
			from:{head:'FROM',separator:', '},
			where:{head:'WHERE',separator:' and ',obj:true},
			group:{head:'GROUP BY',separator:', '},
			have:{head:'HAVING',separator:' and '},
			order:{head:'ORDER BY',separator:', '},
			limit:{head:'LIMIT',separator:', '}
		};

		for(var i in attrs){
			if(!data[i]) continue;
			if(attrs[i].obj && _.isPlainObject(data[i])) data[i] = objToSQLArr(data[i]);
			var tmpVal = countAdd(attrs[i]['head'],strToArr(data[i]),attrs[i]['separator']);
			if(tmpVal && tmpVal.length) sql.push(tmpVal);
		}
		self.query(sql.join(" "),callback,options);
		return self;
	}

	self.update = self.set = function(table,set,where=null,callback=null,options=null){
		if(_.isPlainObject(set)) set = objToSQLArr(set);
		if(_.isPlainObject(where)) where = objToSQLArr(where);
		var sql = [
			'UPDATE '+countAdd('',strToArr(table)),
			'SET '+countAdd('',strToArr(set))
		];
		if(where && where.length) sql.push(countAdd('WHERE',strToArr(where),' and '));
		self.query(sql.join(" "),callback,options);
		return self;
	}

	return self;
}
