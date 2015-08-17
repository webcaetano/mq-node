# mQ node

Mysql library inspired on [mq.php](https://github.com/webcaetano/mQ). 
Suporting JSON to create mysql queries.

Example :

```javascript
var mq = require('mq-node')(({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'players'
});

mq.insert('players',{
	player:'Lulu',
	'goal=80'
}); 

// return INSERT INTO players SET player="Lulu", goal=80
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
