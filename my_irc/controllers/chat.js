var model = require('../models/chat.js');

io.on('connection', function (socket)
{
	//When user types a command
	socket.on('command', function (message) {
		if (message)
		{
			model.commands(message, socket);
		}
	});
});