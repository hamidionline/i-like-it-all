var express = require('express');
var router = express.Router();
var User = require('../models/users')
var instagram = require('../models/instagram')
var keys = require('../config/keys')

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', keys);
});

router.get('/oauth', function(req, res, next) {
	var code = req.query.code;
	instagram.exchange_for_token(code, function(err, insta_obj){
		//get by insta_id
		User.get_by_username(insta_obj.username, function(err, user){
			if(err){
				res.render('error', err);
			}
			if(!user.id){
				user = new User(insta_obj);
			} else {
				user.update(insta_obj);
			}
			user.save();
			res.redirect('/liking/' + user.username);
		})
	})
});

router.get('/liking/:username', function(req, res, next) {
  	User.get_by_username(req.params.username, function(err,user){
		if(err){
			res.render('error', err);
		}
		res.render('show', {"user": user});
  	})
});

router.get('/userdata/:username/hashtags', function(req, res, next) {
	User.get_by_username(req.params.username, function(err,user){
		if(err){
			res.json(err);
		}
		user.get_hashtags(function(err, hashtags){
			if(err){
				res.json(err);
			}
			res.json({"hashtags": hashtags});
		})
  	})
});

module.exports = router;
