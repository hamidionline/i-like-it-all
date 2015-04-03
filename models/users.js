var conString = require('../db')
var pg = require('pg')
var Hashtag = require('./hashtags')
var UserHashtag = require('./user_hashtags')

var User = function(user_obj){
	if(user_obj){
		for(var key in user_obj){
			this[key] = user_obj[key];
		}
	}
}

User.get_by_id = function(user_id, callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			done(client);
			console.log(err);
			return;
		}
		client.query("SELECT * FROM users WHERE id=($1)", [user_id], function(err, result){
			done(client);
			if(err){
				callback(err, undefined);
				return;
			}
			if(callback){
				callback(undefined, new User(result.rows[0]));
				return;
			}
		});
	});
}

// User.get_by_id(1, function(user){
// 	console.log(user);
// })

User.get_by_username = function(username, callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			done(client);
			console.error(err);
			return;
		}
		client.query("SELECT id, username FROM users WHERE username=($1)", [username], function(err, result){
			done(client);
			if(err){
				callback(err, undefined);
				return;
			}
			if(callback){
				callback(undefined, new User(result.rows[0]));
				return;
			}
		});
	});
}

// User.get_by_username("biggler", function(err, user){
// 	if(err){
// 		console.error(err);
// 	}
// 	console.log(user);
// })

User.create = function(username, full_name, callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			done(client);
			console.error(err);
			return;
		}
		client.query("INSERT INTO users(username, full_name) VALUES(($1),($2)) RETURNING *", [username, full_name], function(err, result){
			done(client);
			if(err){
				callback(err, undefined);
				return;
			}
			if(callback){
				callback(undefined, new User(result.rows[0]));
				return;
			}
		});
	});
}

// User.create("rathgirl", "nadia rath", function(err, user){
// 	if(err){
// 		console.error(err);
// 	}
// 	console.log(user);
// })

User.prototype.get_hashtags = function(callback){
	var user = this;
	pg.connect(conString, function(err, client, done){
		if(err){
			done(client);
			console.error(err);
			return;
		}
		client.query("SELECT hashtags.id, hashtags.tag FROM hashtags \
						INNER JOIN user_hashtags ON (hashtags.id = user_hashtags.hashtag_id) \
						INNER JOIN users ON (users.id = user_hashtags.user_id) WHERE users.id = ($1)",
		[user.id], function(err, result){
			done(client);
			if(err){
				callback(err, undefined);
				return;
			}
			var hashtags = [];
			for(i in result.rows){
				hashtags.push(new Hashtag(result.rows[i]))
			}
			if(callback){
				callback(undefined, hashtags);
				return;
			}
		});
	});
}

User.get_by_id(2, function(err, user){
	user.get_hashtags(function(err, hashtags){
		console.log(hashtags)
	})
})

User.prototype.add_hashtag = function(tag, callback){
	var user = this;
		Hashtag.get_by_tag(tag, function(err, hashtag){
			if(Object.getOwnPropertyNames(hashtag).length === 0){
				Hashtag.create(tag, function(err, new_tag){
					UserHashtag.create(user, new_tag, function(err, new_utag){
						callback(undefined, new_tag, new_utag);
					});
				})
			} else {
				UserHashtag.search(user, hashtag, function(err, utag){
					if(Object.getOwnPropertyNames(utag).length === 0){
						UserHashtag.create(user, hashtag, function(err, new_utag){
							callback(undefined, hashtag, new_utag);
						});
					}else{
						callback({"error": "hashtag exists for this user"}, hashtag, utag);
					}
			})
			}
		})
}

// User.get_by_id(2, function(err, user){
// 	user.add_hashtag("kiss", function(err, hashtag, joint_tag){
// 		if(err){
// 			console.error(err);
// 		}
// 		console.log(hashtag)
// 	})
// })


module.exports = User