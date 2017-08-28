var model = require('../models/user.js');

//Handle the registration and the login
exports.log = function (request, result) {
	//Registration
	if (request.body.mail) {
		model.register(request, result);
	}
	//Login
	else {
		model.login(request, result);
	}
};

//Get all the user's info
exports.getInfo = function (request, result) {
	var pseudo = request.session.pseudo;
	model.select(pseudo, result);
};

//Edit the user's info
exports.changeInfo = function (request, result) {
	var pseudo = request.session.pseudo;
	model.update(pseudo, request, result);
}

//Destroy the current session
exports.destroySession = function(request, result) {
	model.destroy(request);
	request.session.destroy(function (err) {
		if (!err)
		{
			result.redirect('/');
		}
	});
};