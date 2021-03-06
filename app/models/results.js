var mongoose = require('mongoose');

var ResultSchema = new mongoose.Schema ({
	studentid: String,
	markerid: String,
	casetitle: String,
	caseid: String,
	markscheme: Object,
	result: Array,
	date: {type:Date, default:Date.now},
	patientscore: Number,
	examinerscore: Number,
	commsfeedback: String
});

module.exports = mongoose.model('caseresults', ResultSchema);