conString = require('../db')
var pg = require('pg')

var Hashtag = function(hashtag_obj){
	this.id = hashtag_obj.id
	this.tag = hashtag_obj.tag
}

Hashtag.create = function(tagname,callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			console.error(err);
			return;
		}
		client.query("INSERT INTO hashtags(tag) VALUES(($1)) RETURNING id, tag", [tagname], function(err, result){
			if(err){
				console.error(err)
				return;
			}
			done(client);
			if(callback){
				callback(new Hashtag(result.rows[0]));
			}
		});
	});
}

// Hashtag.create("trollbot", function(hashtag){
// 	console.log(hashtag)
// })

module.exports = Hashtag