function renderHashtagForms(data){
	var usertemplate = $('#userHashTagTemplate').html();
	var newtemplate = $('#newHashTagTemplate').html();
	Mustache.parse(usertemplate);
	Mustache.parse(newtemplate);
	var userrendered = Mustache.render(usertemplate, data);
	var new_form = Mustache.render(newtemplate,data);

	$('.hashtags').html(userrendered);
	$('.hashtags').append(new_form);
}

function getHashtags(){
	var username = $('.userinfo').data('username');
	$.getJSON('/userdata/' + username + '/hashtags', function(data){
		renderHashtagForms(data);
	})
}

function postHashtag(){
	$('.hashtags').on('submit', '.hashTagForm', function(e){
		e.preventDefault();
		var form = this;
		$.post($(form)[0].action, $(form).serialize())
			.done(function(data){
				if(!data.error){
					getHashtags();
					renderHashtagForms(data);
				}
			});
	})
}

$(document).ready(function(){
	getHashtags();
	postHashtag();
})