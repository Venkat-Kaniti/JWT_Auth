var express = require('express'),
	bodyParser = require('body-parser'),
	log = require('morgan'),
	mongoose = require('mongoose');


var app = express(),
	config = require('./config'),
	User = require('./app/models/user');

var PORT = process.env.PORT || 3000;
var db = mongoose.connect(config.database);
db.connection.once('open', function () {
	console.log('mongodb connection opened');
});
db.connection.on('error', function (err) {
	console.log('error in connecting to the db: ', err);
});

app.set('superSecret', config.secret);

app.use(log('dev'));

app.use(bodyParser.json({
	extended: false
}));

app.use(bodyParser.urlencoded({
	extended: false
}));

app.get('/', function (req, res) {
	res.send('Hello! The API is at http://localhost:' + PORT + '/api');
});

app.get('/setup', function (req, res) {
	var user = new User({
		name: 'Mighty Admin',
		password: 'top password',
		admin: true
	});

	user.save(function (err) {
		if (err) {
			throw err;
		}
		console.log('User saved successfully');
		res.json({ success: true });

	});
});

var apiRouter = require('./routes');
app.use('/api', apiRouter);

app.listen(PORT, function () {
	console.log('server started at port# 3000');
});

	