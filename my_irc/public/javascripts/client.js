$(function()
{
	var socket = io('http://localhost:8080');
		
	//Handle the messages and the commands
	$('.form_chat').submit( function () {
		//If command
		if ($('#message').val().indexOf('/') >= 0) {
			socket.emit('command', $('#message').val());
			$('#message').val('');
		}
		else
		{
			socket.emit('message', $('#message').val(), $('#hidden').val());
			$('#message').val('');
		}

		//Prevent the form from being submit
		return false;
	});

	//Append the message with user's pseudo
	socket.on('message', function (text, pseudo)
	{
		$('#chat_window').append('<p>' + '<span>' + pseudo + ' : ' + '</span>' + text + '</p>');
	});

	//Append all logged-in users
	socket.on('allusers', function (allusers)
	{
		$('#chat_window').append("<p> (Server) <span id='global'> Logged-in users : </span>" + allusers + '</p>');
	});

	//Handle a wrong command
	socket.on('wrong command', function (message)
	{
		$('#chat_window').append("<p> (Server) <span id='global'>" + message + '</span></p>');
	});

	//Handle change nickname and send the nickname to server
	socket.on('nickname', function (nickname)
	{
		$('#chat_window').append("<p> (Server) <span id='global'> You have changed your pseudo to '" + nickname + "'</span></p>");
		socket.emit('change nickname', nickname);	
	});
});