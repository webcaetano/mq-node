var expect = require('chai').expect;
var async = require('async');

var mysql = require('../dist/')({
	host     : 'localhost',
	user     : 'root',
	password : ''
});

describe('mysql test', function() {

	// it('should be connected', function(done) {
	// 	mysql.query('SELECT t1.name,t2.name as teamName FROM players as t1, teams as t2 WHERE t2.id=t1.team',function(err,data){
	// 		console.log(err,data);
	// 		done();
	// 	})
	// });
	// return;

	it('should be connected', function(done) {
		mysql.connection.connect(function(err){
			expect(mysql.connection.state).to.not.be.equal("disconnected");
			expect(err).to.be.null;
			done();
		});
	});

	it('should create a database', function(done) {
		mysql.query('CREATE DATABASE IF NOT EXISTS test',function(err,data){
			expect(data).not.to.be.null;
			expect(err).to.be.null;
			done();
		})
	});

	it('should change a connection', function(done) {
		mysql.connection.changeUser({database:'test'},function(err){
			expect(err).to.be.null;
			done();
		});
	});

	it('should create table if not exist', function(done) {
		mysql.query('CREATE TABLE IF NOT EXISTS test ('+
			'id int(11) NOT NULL AUTO_INCREMENT,'+
			'player varchar(32) NOT NULL,'+
			'team int(11) NOT NULL,'+
			'country int(11) NOT NULL,'+
			'goal int(11) NOT NULL,'+
			'PRIMARY KEY (id)'+
		')',function(err,data){
			expect(data).not.to.be.null;
			expect(err).to.be.null;
			done();
		});
	});

	it('should insert 5 rows', function(done) {
		var players = [
			{player:'Mordekaiser',goal:150,team:'TSM',country:'br'},
			{player:'Darius',goal:100,team:'C9',country:'us'},
			{player:'Lulu',goal:80,team:'CLG',country:'mx'},
			'player="Janna", goal=50, team="CLG", country="us"',
			['player="Nautilus"','goal=30','team="TSM"','country="ch"']
		];

		async.each(players,
		function(player,callback){
			mysql.insert('test',player,function(err,data){
				expect(data).not.to.be.null;
				expect(err).to.be.null;
				callback();
			})
		},function(err,data){
			// mysql.query('select count(*) as q FROM test',function(err,data){
				// expect(data[0]['q']).to.be.equal(5);
				done();
			// })
		});
	});

	// it('should delete some rows', function(done) {
	// 	mysql.delete('test',{player:'Janna'},function(err,data){
	// 		expect(data).not.to.be.null;
	// 		expect(err).to.be.null;
	// 		done();
	// 	})
	// });


	// it('should update some rows', function(done) {
	// 	mysql.set('test',{goal:200},{player:'Darius'},function(err,data){
	// 		expect(data).not.to.be.null;
	// 		expect(err).to.be.null;
	// 	})

	// 	mysql.update('test',{goal:30},{player:'Janna'},function(err,data){
	// 		expect(data).not.to.be.null;
	// 		expect(err).to.be.null;
	// 		done();
	// 	})
	// });

	// it('should escape inject', function(done) {
	// 	mysql.set('test',{'player':'D\a\ri"us'},{goal:200},function(err,data){
	// 		expect(data).not.to.be.null;
	// 		expect(err).to.be.null;
	// 		done();
	// 	})
	// });
	it('should select some rows', function(done) {
		mysql.select({
			from:'test',
			cols:['player','goal','id',{team:['team','country']}],
			where:'1'
		},function(err,data){
			expect(data).to.have.length.of.at.least(3);
			done();
		})
	});


	// it('should select some rows', function(done) {
		// mysql.select({
		// 	from:'test',
		// 	cols:['player','goal','id'],
		// 	where:{player:'Janna'}
		// },function(err,data){
		// 	expect(data.length).to.be.equal(0);
		// })

	// 	mysql.select({
	// 		from:'test',
	// 		cols:['player','goal','id'],
	// 		where:{player:'Twitch'}
	// 	},function(err,data){
	// 		expect(data[0]['player']).to.be.equal('Twitch');
	// 		// expect(data[0]['goal']).to.be.equal(200);
	// 		done();
	// 	})
	// });


	it('should drop table', function(done) {
		mysql.query('DROP TABLE test',function(err,data){
			expect(data).not.to.be.null;
			expect(err).to.be.null;
			done();
		})
	});
});
