var MongoClient = require("mongodb").MongoClient;
var passwordHash = require('password-hash');
var index = 0;

//Handle the registration
exports.register = function (request, res) {
	MongoClient.connect("mongodb://localhost:27017/my_irc", function(error, db) {
		if (error) throw error;

		//Hash password
		var password = passwordHash.generate(request.body.password);
		var user = { pseudo: request.body.pseudo, mail: request.body.mail, password: password };

		db.collection("Users").findOne({ pseudo: request.body.pseudo }, function(err, result) {
			//If an account with this username already exists
			if (result)
			{
				res.render('index', {error_reg : "Sorry, this pseudo is already taken"});
			}
			else
			{
				//Check if an account with this email already exists
				db.collection("Users").findOne({ mail: request.body.mail }, function(err, result) {
					if (result)
					{
						res.render('index', {error_reg : "An account with this email already exists"});
					}
					else
					{
						db.collection("Users").insert(user, null);
						db.collection("Users").findOne({ pseudo: request.body.pseudo }, function(err, result)
						{
							if (err)
							{
								res.render('index', {error_reg : "There's a problem during your register, please try again"});
							}
							//Save all user's info and redirect to the chat
							else
							{
								logUsers[index] = result;
								request.session.pseudo = result.pseudo;
								currentUser = result;
								index++;

								res.redirect('chat');
							}
						});
					}
				});
			}
		});
	});
};

//Handle the connexion
exports.login = function (request, res) {
	MongoClient.connect("mongodb://localhost:27017/my_irc", function(error, db) {
		if (error) throw error;

		db.collection("Users").findOne({ pseudo: request.body.pseudo }, function(err, result)
		{
			//Check the password and save the user's info
			if (passwordHash.verify(request.body.password, result.password))
			{
				logUsers[index] = result;
				request.session.pseudo = result.pseudo;
				currentUser = result;
				index++;

				res.redirect('/chat');
			}
			else
			{
				res.render('index', {error_log : 'Wrong password'});
			}
		});
	});
};

//Select all the user's info for the edit form
exports.select = function (pseudo, res) {
	MongoClient.connect("mongodb://localhost:27017/my_irc", function(error, db) {
		if (error) throw error;

		db.collection("Users").findOne({ pseudo: pseudo }, function(err, result)
		{
			if (result)
			{
				res.render('edit', {pseudo : result.pseudo, email: result.mail});
			}
		});
	});
};

//Update user's info
exports.update = function (pseudo, req, res) {
	if (req.body.password === req.body.confirmationPassword)
	{
		MongoClient.connect("mongodb://localhost:27017/my_irc", function(error, db) {
			if (error) throw error;

			//Hash the password
			var password = passwordHash.generate(req.body.password);
			db.collection("Users").update({ pseudo: pseudo }, { $set: { pseudo: req.body.pseudo, mail: req.body.email, password: password }}, function(err, result)
			{
				if (result)
				{
					//Render the edit form with the new data
					db.collection("Users").findOne({ pseudo: req.body.pseudo }, function(err, reslt)
					{
						res.render('edit', {pseudo : reslt.pseudo, email: reslt.mail, succeed: 'Changes saved !'});
					});
				}
				else
				{
					res.render('edit', {error: 'Please try again'});
				}
			});
		});
	}
	else
	{
		//Render the edit form with the old data and an error
		MongoClient.connect("mongodb://localhost:27017/my_irc", function(error, db) {
			if (error) throw error;

			db.collection("Users").findOne({ pseudo: pseudo }, function(err, result)
			{
				if (result)
				{
					res.render('edit', {pseudo : result.pseudo, email: result.mail, error: 'Passwords are not the same'});
				}
			});
		});
	}
}

//Delete user's info in logUsers array
exports.destroy = function(request) {
	logUsers.forEach(function (index, value) {
		if (logUsers[value].pseudo == request.session.pseudo)
		{
			delete logUsers[value];
			currentUser = "";
		}
	});
}