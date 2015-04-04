var request = require('request');
var keys = require('../config/keys')

function instagram(){
	this.something = "something";
}


instagram.exchange_for_token = function(code, callback){
	var token_request_obj = {"client_id": keys.client_id, 
							"client_secret": keys.client_secret,
							"redirect_uri": keys.redirect_uri,
							"grant_type": "authorization_code",
							"code": code};
	request.post({url: "https://api.instagram.com/oauth/access_token", form: token_request_obj},
					function(err, response, body){
						if(err){
							console.error(err);
							callback(err, undefined);
							return;
						}
						callback(undefined, clean_token(body));
						return;
				})
}

var clean_token = function(token){
	var token = JSON.parse(token);
	var insta_obj = {};
	insta_obj.oauth_token = token.access_token;
	insta_obj.insta_id = token.user.id;
	insta_obj.profile_picture = token.user.profile_picture;
	insta_obj.full_name = token.user.full_name;
	insta_obj.username = token.user.username;
	return insta_obj;
}

module.exports = instagram