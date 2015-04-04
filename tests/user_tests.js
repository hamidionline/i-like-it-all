var User = require('../models/users')

// var g = new User({"hello": "yo", "sup": "dawg"})
// console.log(g)

// User.get_by_id(1, function(user){
// 	console.log(user);
// })

// User.get_by_username("biggler", function(err, user){
// 	if(err){
// 		console.error(err);
// 	}
// 	console.log(user);
// })

// var greg = new User({"username": "lolman",
// 						"full_name": "g p",
// 						"profile_picture": "www.goo.com",
// 						"oauth_token": "fkeifei",
// 						"insta_id" :  4949594
// 					})

// greg.save(function(err, result){
// 	console.log(err)
// 	console.log(result)
// })

// User.get_by_username("lolman", function(err, user){
// 	user.full_name = "greg dicks";
// 	user.save(function(err, result){
// 		console.log(err);
// 		console.log(result);
// 	})
// })

// User.create("rathgirl", "nadia rath", function(err, user){
// 	if(err){
// 		console.error(err);
// 	}
// 	console.log(user);
// })

// User.get_by_id(2, function(err, user){
// 	user.get_hashtags(function(err, hashtags){
// 		console.log(hashtags)
// 	})
// })

// User.get_by_id(2, function(err, user){
// 	user.add_hashtag("kiss", function(err, hashtag, joint_tag){
// 		if(err){
// 			console.error(err);
// 		}
// 		console.log(hashtag)
// 	})
// })