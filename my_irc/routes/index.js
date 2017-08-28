var express = require('express');
var router = express.Router();
var user = require('../controllers/user');
var chat = require('../controllers/chat');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/', function(req, res, next) {
  user.log(req, res);
});

router.get('/chat', function(req, res, next) {
	if (req.session.pseudo)
	{
		res.render('chat', {pseudo: req.session.pseudo});
	}
	else
	{
		res.redirect('/');
	}
});

router.get('/user', function(req, res, next) {
	if (req.session.pseudo)
	{
		var userData = user.getInfo(req, res);
	}
	else
	{
		res.redirect('/');
	}
});

router.post('/user', function(req, res, next) {
	user.changeInfo(req, res);
})

router.get('/logout', function(req, res, next) {
	if (req.session.pseudo)
	{
		user.destroySession(req, res);
	}
	else
	{
		res.redirect('/');
	}
});

module.exports = router;
