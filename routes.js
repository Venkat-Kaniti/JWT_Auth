var jwt = require('jsonwebtoken');
var config = require('./config');
var apiRouter = require('express').Router();
var User = require('mongoose').model('User');

apiRouter.post('/authenticate', function (req, res) {
	User.findOne({
		name: req.body.name
	}, function (err, user) {
		if (err) {
			throw err;
		}
		if (!user) {
			return res.json({
				success: false,
				message: 'User not found'
			});
		} else if (user) {
			if (user.password !== req.body.password) {
				return res.json({
					success: false,
					message: 'Wrong password'
				});
			}

			var token = jwt.sign(user, config.secret, {
				expiresInMinutes: 1440
			});
			return res.json({
				success: true,
				message: 'Enjoy your token',
				token: token
			});
		}
	});
});

apiRouter.use(function (req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (token) {
		jwt.verify(token, config.secret, function (err, decoded) {
			if (err) {
				return res.json({
					success: false,
					message: 'Failed to authenticate token'
				});
			} else {
				req.decoded = decoded;
				next();
			}

		});
	} else {
		return res.status(404).send({
			success: false,
			message: 'Token missing'
		});
	}

});

apiRouter.get('/', function (req, res) {
	res.json('Welcome to awesome api in the world');
});

apiRouter.get('/users', function (req, res) {
	User.find({}, function (err, users) {
		if (err) {
			throw err;
		}

		res.json(users);
	});
});





exports = module.exports = apiRouter;