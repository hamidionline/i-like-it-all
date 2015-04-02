conString = require('../db')
var pg = require('pg')
var Hashtag = require('./hashtags')
var User = require('./users')

var UserHashtag = function(utag_obj){
	if(utag_obj){
		if("id" in utag_obj){
			this.id = utag_obj.id;
		} else {
			this.id = undefined;
		}
		if("user_id" in utag_obj && "hashtag_id" in utag_obj){
			this.user_id = utag_obj.user_id;
			this.hashtag_id = utag_obj.hashtag_id;
		} else {
			this.user_id = undefined;
			this.hashtag_id = undefined;
		}
	}
}

UserHashtag.create = function(user, hashtag, callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			console.error(err);
			return;
		}
		client.query("INSERT INTO user_hashtags(user_id, hashtag_id) VALUES(($1), ($2)) RETURNING id, user_id, hashtag_id", [user.id, hashtag.id], function(err, result){
			if(err){
				console.error(err)
				return;
			}
			done(client);
			if(callback){
				callback(new UserHashtag(result.rows[0]));
			}
		});
	});
}

UserHashtag.search = function(user, hashtag, callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			console.log(err);
			return;
		}
		client.query("SELECT * FROM user_hashtags WHERE user_id=($1) AND hashtag_id=($2)", [user.id, hashtag.id], function(err, result){
			if(err){
				console.log(err);
				return;
			}
			done(client);
			callback(new UserHashtag(result.rows[0]));
		});
	});
}

// User.get_by_id(1, function(user){
// 	UserHashtag.search(user, {"id":1}, function(hashtag, utag){
// 		console.log(hashtag)
// 	})
// })

module.exports = UserHashtag