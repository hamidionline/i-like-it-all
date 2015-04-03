conString = require('../db')
var pg = require('pg')

var Hashtag = function(hashtag_obj){
	if(hashtag_obj){
		for(var key in hashtag_obj){
			this[key] = hashtag_obj[key];
		}
	}
}

Hashtag.create = function(tagname,callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			done(client);
			console.error(err);
			return;
		}
		client.query("INSERT INTO hashtags(tag) VALUES(($1)) RETURNING id, tag", [tagname], function(err, result){
			done(client);
			if(err){
				callback(err, undefined);
				return;
			}
			if(callback){
				callback(undefined, new Hashtag(result.rows[0]));
				return;
			}
		});
	});
}

// Hashtag.create("trollbot", function(hashtag){
// 	console.log(hashtag)
// })

Hashtag.get_by_tag = function(tagname, callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			done(client);
			console.log(err);
			return;
		}
		client.query("SELECT * FROM hashtags WHERE tag=($1)", [tagname], function(err, result){
			done(client);
			if(err){
				callback(err, undefined);
				return;
			}
			if(callback){
				callback(undefined, new Hashtag(result.rows[0]));
				return;
			}
		});
	});
}

// Hashtag.get_by_tag("lol", function(hashtag){
// 	console.log(hashtag)
// })

module.exports = Hashtag