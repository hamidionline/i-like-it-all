var conString = require('../db')
var pg = require('pg')
var Hashtag = require('./hashtags')
var UserHashtag = require('./user_hashtags')

var User = function(insta_obj){
	this.update(insta_obj);
}

User.prototype.update = function(insta_obj){
	if(insta_obj){
		for(var key in insta_obj){
			this[key] = insta_obj[key];
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

User.get_by_username = function(username, callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			done(client);
			console.error(err);
			return;
		}
		client.query("SELECT * FROM users WHERE username=($1)", [username], function(err, result){
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

User.prototype.save = function(callback){
	var user = this;
	pg.connect(conString, function(err, client, done){
		if(err){
			done(client);
			console.error(err);
			return;
		}
		if(user.id){
			client.query("UPDATE users\
						SET username=($1), full_name=($2), profile_picture=($3),\
						oauth_token=($4), insta_id=($5) WHERE id=($6)", 
						[user.username, user.full_name, user.profile_picture, user.oauth_token, user.insta_id, user.id], 
						function(err, result){
							done(client);
							if(callback){
								callback(err, result);
								return;
							}
						});
		} else {
			client.query("INSERT INTO users\
						(username, full_name, profile_picture, oauth_token, insta_id)\
						VALUES(($1),($2),($3),($4),($5))", 
						[user.username, user.full_name, user.profile_picture, user.oauth_token, user.insta_id], 
						function(err, result){
							done(client);
							if(callback){
								callback(err, result);
								return;
							}
						});
		}
	});
}

User.prototype.get_hashtags = function(callback){
	var user = this;
	pg.connect(conString, function(err, client, done){
		if(err){
			done(client);
			console.error(err);
			return;
		}
		client.query("SELECT hashtags.id, hashtags.tag, user_hashtags.id AS uhid FROM hashtags \
						INNER JOIN user_hashtags ON (hashtags.id = user_hashtags.hashtag_id) \
						INNER JOIN users ON (users.id = user_hashtags.user_id) WHERE users.id = ($1)",
		[user.id], function(err, result){
			done(client);
			if(err){
				callback(err, undefined);
				return;
			}
			var hashtags = [];
			for(var i in result.rows){
				hashtags.push(new Hashtag(result.rows[i]));
			}
			if(callback){
				callback(undefined, hashtags);
				return;
			}
		});
	});
}

// User.get_by_id(6, function(err, user){
// 	user.get_hashtags(function(err, hashtags){
// 		console.log(hashtags)
// 	})
// })

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

// clean this up error checking
User.prototype.update_hashtag = function(utagId, newTagName, callback){
	var user = this;
	UserHashtag.get_by_id(utagId, function(err, utag){
		Hashtag.get_by_tag(newTagName, function(err, hashtag){
			if(Object.getOwnPropertyNames(hashtag).length === 0){
				Hashtag.create(newTagName, function(err, new_tag){
						utag.hashtag_id = new_tag.id;
						utag.save();
						callback(undefined, new_tag, utag);
				});
			} else {
				utag.hashtag_id = hashtag.id;
				utag.save();
				callback(undefined, hashtag, utag);
			}
		})
	})
}


module.exports = User