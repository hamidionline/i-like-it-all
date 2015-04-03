conString = require('../db')
var pg = require('pg')
var Hashtag = require('./hashtags')
var User = require('./users')

var UserHashtag = function(utag_obj){
	if(utag_obj){
		for(var key in utag_obj){
			this[key] = utag_obj[key];
		}
	}
}

UserHashtag.create = function(user, hashtag, callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			done(client);
			console.error(err);
			return;
		}
		client.query("INSERT INTO user_hashtags(user_id, hashtag_id) VALUES(($1), ($2)) RETURNING id, user_id, hashtag_id", [user.id, hashtag.id], function(err, result){
			done(client);
			if(err){
				callback(err, undefined);
				return;
			}
			if(callback){
				callback(undefined, new UserHashtag(result.rows[0]));
				return;
			}
		});
	});
}

UserHashtag.search = function(user, hashtag, callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			done(client);
			console.error(err);
			return;
		}
		client.query("SELECT * FROM user_hashtags WHERE user_id=($1) AND hashtag_id=($2)", [user.id, hashtag.id], function(err, result){
			done(client);
			if(err){
				callback(err, undefined, undefined);
				return;
			}
			if(callback){
				callback(undefined, hashtag, new UserHashtag(result.rows[0]));
				return;
			}
		});
	});
}

// User.get_by_id(1, function(err, user){
// 	UserHashtag.search(user, {"id":1}, function(err, hashtag, utag){
// 		console.log(hashtag)
// 	})
// })

module.exports = UserHashtag