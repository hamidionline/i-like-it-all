conString = require('../db')
var pg = require('pg')

var Hashtag = function(hashtag_obj){
	if(hashtag_obj){
		if("id" in hashtag_obj){
			this.id = hashtag_obj.id;
		} else {
			this.id = undefined;
		}
		if("tag" in hashtag_obj){
			this.tag = hashtag_obj.tag
		} else {
			this.tag = undefined;
		}
	}
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

Hashtag.get_by_tag = function(tagname, callback){
	pg.connect(conString, function(err, client, done){
		if(err){
			console.log(err);
			return;
		}
		client.query("SELECT * FROM hashtags WHERE tag=($1)", [tagname], function(err, result){
			if(err){
				console.log(err)
				return;
			}
			done(client);
			callback(new Hashtag(result.rows[0]))
		});
	});
}

Hashtag.get_by_tag("lol", function(hashtag){
	console.log(hashtag)
})

module.exports = Hashtag