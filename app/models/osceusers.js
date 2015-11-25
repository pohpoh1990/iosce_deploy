var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema ({
	username: String,
	fullname: String,
	email: String,
	password: String,
	role: [String],
	uni: String,
	caseAuthor: [String],
	caseDone: [String],
	scenarioAuthor: [String],
	scenarioDone: [String],
	practices: Number,
	emailverified: Boolean,
	token: String,
	friends: [String],
	pendingcomfirmation: [String],
	ratedcase: Array
});

module.exports = mongoose.model('OsceUser', UserSchema);