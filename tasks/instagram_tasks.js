var User = require('../models/users');
var UserHashtag = require('../models/user_hashtags');
var instagram = require('../models/instagram');
var request = require('request');

var search_task = function(callback){
	UserHashtag.all_query(function(err, query_array){
		for(var i in query_array){
			var tag_obj = query_array[i];
			if(tag_obj.like_amount > 0){
				console.log(tag_obj.uhid)
				instagram.search_hashtag(tag_obj.token, tag_obj.tag,
					function(err, posts){
						if(err){
							callback(err, undefined, undefined);
							return;
						}
						callback(undefined, posts, tag_obj);
				});
			}
		}
	})
}

var validate_post = function(post, tag_obj){
	if(post.created_time > tag_obj.last_liked){
		return true;
	}
	return false;
}

var set_last_liked = function(post, tag_obj){
	UserHashtag.get_by_id(tag_obj.uhid, function(err, utag){
		utag.last_liked = post.created_time;
		utag.save();
	});
}

var like_post = function(post, tag_obj){
	request.post({url: "https://api.instagram.com/v1/media/" + post.id + "/likes", form: {"access_token": tag_obj.token}}, 
		function(err, response, body){
			console.log("LIKING")
			console.log(body)
			set_last_liked(post, tag_obj)
		})
}

search_task(function(err, posts, tag_obj){
	for(var i in posts.data){
		var post = posts.data[i];
		var liked = false;
		if(validate_post(post, tag_obj)){
			like_post(post, tag_obj);
			liked = true;
		}
		console.log({"postUrl": post.link, "imageUrl": post.images.standard_resolution.url, "liked":liked})
	}
})




// User.get_by_id(6, function(err, user){
// 	user.get_hashtags(function(err, hashtags){
// 		instagram.search_hashtag(user, {"tag":"myhammacondadont"}, "957287442212813436_33735605", function(err, posts){
// 			for(var i in posts.data){
// 				console.log(posts.data[i].created_time)
// 			}
// 		});
// 	})
// })