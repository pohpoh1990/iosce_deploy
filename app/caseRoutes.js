var mongoose = require('mongoose');
var ExamCase = require('./models/examcases.js');
var OsceUser = require('./models/osceusers.js');

module.exports = function(app, passport){
	app.post('/examcases/:id', auth, function(req, res){
		console.log(req.body);
		var newExamCase = new ExamCase(req.body);
		newExamCase.markschemeid = req.params.id;
		newExamCase.rating = 0;
		newExamCase.difficulty = 0;
		newExamCase.save(function(err){
			if (err) {console.log(err)}
			if (!err){
				res.json("Case added successfully!");
				console.log("New case added!");
			}
		})
	})

	//Saving files onto mongoDB with GridFS
	var Grid = require('gridfs-stream');
	var fs = require('fs');
	Grid.mongo = mongoose.mongo;
	var gfs = Grid(mongoose.connection.db);
	var multer = require('multer');
	var upload = multer({
	    upload: null,// take uploading process 
	});
	var async = require('async');

	app.post('/upload', auth, upload.array('files'), function(req, res){
		var responseFile = [];
		console.log(req.body);
		console.log(req.files);

		for (var i=0; i<req.files.length; i++){
			var file = req.files[i];
			var added = 0;
			var writeStream = gfs.createWriteStream({
				filename: file.originalname,
			    mode: "w",
			    content_type: file.mimetype,
			});
			writeStream.on('close', function(file){
				console.log('File added successfully: '+file.filename);
				console.log("Inside");
				responseFile.push(file);
				if (++added == req.files.length){
					res.json(responseFile);
				}
			});
			writeStream.write(file.buffer);
			writeStream.end();
			console.log("Outside")
		};
	})

	app.get('/upload/:id', function(req, res){
		gfs.findOne({_id: req.params.id}, function(err, file){
			if (err) {
				return res.status(400).send(err)
			}
			if (!file){
				return res.status(404).send('')
			}
			res.set('Content-Type', file.contentType);
			res.set('Content-Disposition', 'attachment; filename="'+ file.filename + '"');
			var readstream = gfs.createReadStream({_id: file._id});
			readstream.on("error", function(err){
				console.log("Error while processing stream: "+err.message);
				res.end()
			});
			readstream.pipe(res);
		})
	})
	// Save files to mongoDB end


	app.get('/cases/:id', function(req, res){
		ExamCase.find({markschemeid: req.params.id}, function(err, cases){
			if (err) {console.log(err)}
			if(!err) {
				res.json(cases);
				console.log("Sent cases.")
			}
		})
	})

	app.get('/singlecase/:id', function(req, res){
		ExamCase.findOne({_id: req.params.id}, function(err, onecase){
			if (err) {console.log(err)}
			if(!err) {
				res.json(onecase);
				console.log("Sent onecase.")
			}
		})
	})

	app.post('/caserating/:id', auth, function(req, res){
		OsceUser.findByIdAndUpdate(req.body.myid, {
			$push: {ratedcase: req.params.id}
		}, function(err){
			if (err) {console.log(err)}
			if(!err) {
				console.log("Ratedcase for user updated.");
			}
		})
		ExamCase.findByIdAndUpdate(req.params.id, {
			$inc: {
				ratecount: 1, 
				rating: req.body.rating, 
				difficulty: req.body.difficulty
			}}, 
			function(err, onecase){
				if (err) {console.log(err)}
				if(!err) {
					console.log("Rating updated.");
					res.json("Rating updated.");
				}
			}
		)
	})

	app.get('/casecreated/:id', auth, function(req, res){
		var id = req.params.id;
		ExamCase.find({author:id}, function(err, casecreated){
			res.json(casecreated);
			console.log("Casecreated sent");
		})
	});

	app.get('/all/casecreated', auth, function(req, res){
		var id = req.params.id;
		ExamCase.find({}, function(err, casecreated){
			res.json(casecreated);
			console.log("Casecreated sent");
		})
	});

	app.get('/deletecasecreated/:caseid/:myid', auth, function(req, res){
		var caseid = req.params.caseid;
		var myid = req.params.myid;
		ExamCase.findOne({_id: caseid}, function(err, casecreated){
			for (var i=0; i<casecreated.file.length; i++){
				if(casecreated.file[i]){
					gfs.remove({_id:casecreated.file[i]._id}, function(err){
						console.log('Delete success.')
					})
				};
				if (++i == casecreated.file.length){
					ExamCase.remove({_id: caseid}, function(err){
						if (err) return err;
						ExamCase.find({studentid:myid}, function(err, casecreated){
							res.json(casecreated);
						});
					})
				};
			}
		});
	})
}

function auth(req, res, next){
	if (!req.isAuthenticated())
		res.send(401);
	else
		next();
};