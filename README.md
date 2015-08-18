# mQ node

Mysql library inspired on [mQ.php](https://github.com/webcaetano/mQ). 
Suporting JSON to create mysql queries.

Example :

```javascript
var mq = require('mq-node')({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'players'
});

mq.insert('players',{
	player:'Lulu',
	goal:80
}); 

// return INSERT INTO players SET player="Lulu", goal=80
```

## Query

mq.query(query[string],callback)

```javascript
mq.query('SELECT 1+1 as s',function(data,err){
	//result data[0]['s'] 2
})
```

## Delete

mq.delete(table[string or array], where[string, object or array],callback)

```javascript
mysql.delete('test',{player:'Janna'},function(data,err){
});

// return DELETE FROM test where player="Janna"

mysql.delete('test',['player:"Janna"','score=100'},function(data,err){
});

// return DELETE FROM test where player="Janna" and score=100

mysql.delete('test','player:"Janna" or score=100',function(data,err){
});

// return DELETE FROM test where player="Janna" or score=100
```

## Insert 

mq.insert(table[string or array],set [string, object or array],callback)

```javascript
mq.insert('players',{
	player:'Lulu',
	goal:80
}); 

// return INSERT INTO players SET player="Lulu", goal=80

mq.insert('players',[
	'player="Lulu"',
	'goal=80'
]); 

// return INSERT INTO players SET player="Lulu"

mq.insert('players','player="Lulu", goal=80'); 

// return INSERT INTO players SET player="Lulu"
```

## Install

```Batchfile
npm install mq-node
```


### Project Road : 

- Finish documentation
- Finish readme

---------------------------------

The MIT [License](https://raw.githubusercontent.com/webcaetano/mq-node/master/LICENSE.md)
