var mongoose = require('mongoose');

var ExamCases = new mongoose.Schema ({
	title: String,
	examination: String,
	markschemeid: String,
	markscheme: Object,
	brief: [String],
	file: Array,
	rating: Number,
	difficulty: Number,
	ratecount: Number,
	rateaverage: Number,
	author: String,
	caseid: Number
});

module.exports = mongoose.model('examcases', ExamCases);