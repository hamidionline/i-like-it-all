conString = require('../db')
var pg = require('pg')
var Hashtag = require('./hashtags')

var User = function(user_obj){
	this.id = user_obj['id'];
	this.username = user_obj['username'];
}

User.get_by_id = function(user_id, callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			console.log(err);
			return;
		}
		client.query("SELECT * FROM users WHERE id=($1)", [user_id], function(err, result){
			if(err){
				console.log(err)
				return;
			}
			done(client);
			callback(new User(result.rows[0]))
		});
	});
}

// User.get_by_id(1, function(user){
// 	console.log(user);
// })

User.get_by_username = function(username, callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			console.log(err);
			return;
		}
		client.query("SELECT * FROM users WHERE username=($1)", [username], function(err, result){
			if(err){
				console.log(err)
				return;
			}
			done(client);
			callback(new User(result.rows[0]))
		});
	});
}

// User.get_by_username("scoin", function(user){
// 	console.log(user);
// })

User.create = function(username,callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			console.error(err);
			return;
		}
		client.query("INSERT INTO users(username) VALUES(($1)) RETURNING id, username", [username], function(err, result){
			if(err){
				console.error(err)
				return;
			}
			done(client);
			if(callback){
				callback(new User(result.rows[0]));
			}
		});
	});
}

// User.create("biggler", function(user){
// 	console.log(user)
// })

User.prototype.get_hashtags = function(callback){
	var user = this;
	pg.connect(conString, function(err, client, done){
		if(err){
			console.error(err);
			return;
		}
		client.query("SELECT hashtags.id, hashtags.tag FROM hashtags \
						INNER JOIN user_hashtags ON (hashtags.id = user_hashtags.hashtag_id) \
						INNER JOIN users ON (users.id = user_hashtags.user_id) WHERE users.id = ($1)",
		[user.id], function(err, result){
			if(err){
				console.error(err)
				return;
			}
			done(client);
			var hashtags = [];
			for(i in result.rows){
				hashtags.push(new Hashtag(result.rows[i]))
			}
			if(callback){
				callback(hashtags);
			}
		});
	});
}

User.get_by_id(1, function(user){
	user.get_hashtags(function(hashtags){
		console.log(hashtags)
	})
})



User.prototype.add_hashtag = function(tag){
	pg.connect(conString, function(err, client, done){
		if(err){
			console.error(err);
			return;
		}
		client.query("INSERT INTO users(username) VALUES(($1)) RETURNING id, username", [username], function(err, result){
			if(err){
				console.error(err)
				return;
			}
			done(client);
			if(callback){
				callback(new User(result.rows[0]));
			}
		});
	});
}

module.exports = User