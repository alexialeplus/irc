var MongoClient = require("mongodb").MongoClient;

//Look for the command in the BDD
exports.commands = function (message, socket) {
	var arrayMsg = message.split(" ");

	MongoClient.connect("mongodb://localhost:27017/my_irc", function(error, db) {
		if (error) throw error;

		db.collection("Commands").findOne({ shortcut: arrayMsg[0] }, function (err, result) {
			if (result)
			{
				//Command /users
				if (result.name === 'users')
				{
					var allusers = "";

					logUsers.forEach(function (index, value)
					{
						allusers += logUsers[value].pseudo + ", ";
					});

					socket.emit('allusers', allusers);
				}
				//Command /nick <pseudo>
				else if (result.name === 'nickname')
				{
					nickname = arrayMsg[1];
					nickname = nickname.replace('<', '').replace('>', '');

					socket.emit('nickname', nickname);
				}
			}
			//If the command doesn't exist, render an error message
			else
			{
				db.collection("Global").findOne({ name: 'wrong command' }, function (err, result) {
					if (result)
					{
						socket.emit('wrong command', result.message);
					}
				});
			}
		});
	});
}