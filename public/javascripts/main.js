function getHashtags(){
	var username = $('.userinfo').data('username');
	console.log(username)
	$.getJSON('/userdata/' + username + '/hashtags', function(data){
		console.log(data)
		var usertemplate = $('#userHashTagTemplate').html();
		var newtemplate = $('#newHashTagTemplate').html();
		Mustache.parse(usertemplate);
		Mustache.parse(newtemplate);
		var userrendered = Mustache.render(usertemplate, data);
		var new_form = Mustache.render(newtemplate,data);

		$('.hashtags').html(userrendered);
		$('.hashtags').append(new_form);

	})
}
$(document).ready(function(){
	getHashtags();
})