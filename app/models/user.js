var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports = module.exports = mongoose.model('User', new Schema({
	name: String,
	password: String,
	admin: Boolean
}));
