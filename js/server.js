$(document).ready( function(){
		$("#pause").click(pause);
		$("#resume").click(resume);
		$("#restart").click(restart);
		update();
	});
var timer
function update() {
    timer = setInterval(function () {
        updateLocal();
    }, 1000)
}

function updateLocal() {
	$.getJSON( "/serverData", function( data ) {
	  var items = [];
	  $.each( data, function( key, val ) {
		if (key == 'results' && val != '-1'){ return;}
		items.push( "<li id='" + key + "'>" + key + ":" + val + "</li>" );
	  });

	 $('.response').html($( "<ul/>", {
		"class": "my-new-list",
		html: items.join( "" )
	  }))
	});
}

function pause() {
	$.ajax({
		url: '/serverData',
		type: 'post',
		data: 'pause'
	});
	clearInterval(timer);
}

function resume() {
    $.ajax({
		url: '/serverData',
		type: 'post',
		data: 'resume'
	});
	update();
}

function restart() {
	$('.response').remove();
	$('body').append('<div class="response"></div>');
    $.ajax({
		url: '/serverData',
		type: 'post',
		data: 'restart'
	});
	update();
}