var express = require('express');
var router = express.Router();
var conString = require('../db')
var pg = require('pg')

/* GET home page. */
router.get('/', function(req, res, next) {
	pg.connect(conString, function(err, client, done){
		if(err){
			console.log(err);
			return;
		}
		client.query("INSERT INTO visits(date) VALUES($1)", [new Date()], function(err, result){
			if(err){
				console.log(err)
				return;
			}
			done(client);
		});
	});
  	res.render('index', { title: 'Express' });
});

module.exports = router;
