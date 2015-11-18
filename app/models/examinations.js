var mongoose = require('mongoose');

var ExaminationSchema = new mongoose.Schema ({
	title: String,
	markscheme: Array,
	rating: String,
	author: String,
});

module.exports = mongoose.model('examinations', ExaminationSchema);