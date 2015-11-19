var port = Number(process.env.PORT || 3000);
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var app = express();

app.use(express.static(__dirname + "/public"));

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://osce247:startuposce247@ds037283.mongolab.com:37283/osce247');
//var db = mongoose.connect('mongodb://localhost/markschemeproject');
var OsceUser = require('./app/models/osceusers.js');
var ExamCase = require('./app/models/examcases.js');
var Examination = require('./app/models/examinations.js');
var Result = require('./app/models/results.js')

var nodemailer = require('nodemailer');
var generator = require('xoauth2').createXOAuth2Generator({
    user: 'osce247@gmail.com',
    clientId: '135689671704-vu5m877fan7vjbhkp96c9ol99naifkgc.apps.googleusercontent.com',
    clientSecret: '7dewTn0Bp4kbL3dMPc9tE24T',
    refreshToken: '1/9OJ7DYZ6ZutdVoNdwnOit8Bv0mAjaKJnkq5nLzb_p2lIgOrJDtdun6zK6XiATCKT'
});

// login gmail
var transporter = nodemailer.createTransport(({
    service: 'gmail',
    auth: {
        xoauth2: generator
    }
}));

var passport = require("passport");
var MongoStore = require('connect-mongo')(session);
//Cookies
app.use(session({
	secret: 'boomshakalaka',
	saveUninitialized: true,
	resave: true,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		ttl: 2*60*60
	})
}));
app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
require('./app/userAuthRoutes')(app, passport, transporter);
require('./app/caseRoutes')(app, passport);

//Routes
app.get('/all/examcases', function(req, res){
	ExamCase.find({}).sort({specialty:1}).exec(
		function(err, scenario){
			res.json(scenario);
	});
})

app.post('/examination', auth, function(req, res){
	console.log(req.body);
	var newExamination = new Examination(req.body);
	newExamination.rating = 0;
	newExamination.difficulty = 0;
	Examination.count({}, function(err, count){
		console.log("Examination count: "+count);
		newExamination.save(function(err){
			if (err) {console.log(err)}
			if (!err){
				res.json("Scenario added successfully!");
				console.log("New scenario added!");
			}
		})

	})
})

app.get('/all/examination/', function(req, res){
	Examination.find({}, function(err, examinations){
		if (err) {console.log(err)}
		if(!err) {
			res.json(examinations);
			console.log("Sent examinations mark schemes.")
		}
	})
})

app.get('/markscheme/:id', function(req, res){
	Examination.findOne({_id: req.params.id}, function(err, examination){
		if (err) {console.log(err)}
		if(!err) {
			res.json(examination);
			console.log("Sent examination: "+examination);
		}
	});
})

app.get('/allpeers/', auth, function(req, res){
	OsceUser.find({}, 'username email _id', function(err, users){
		if (err) {console.log(err)}
		if(!err) {
			res.json(users);
			console.log("Sent users.")
		}
	})
})

app.post('/postresult/', auth, function(req, res){
	var newResult = new Result(req.body);
	OsceUser.findByIdAndUpdate(newResult.studentid, {$push:{caseDone: newResult.caseid}}, 
		function(){
			console.log("Added caseid to user "+newResult.studentid);
		}
	)
	newResult.save(function(err){
		if (err){console.log(err)}
		if (!err){
			res.json("newResult added!");
			console.log("newResult added");
			console.log(newResult);
		}
	});
})

app.get('/all/result', function(req, res){
	Result.find({}, function(err, results){
		res.json(results);
		console.log("Find results")
	})
})

app.get('/result/:id', auth, function(req, res){
	var id = req.params.id;
	Result.find({studentid:id}, function(err, results){
		res.json(results);
		console.log("Results sent");
	})
});

function auth(req, res, next){
	if (!req.isAuthenticated())
		res.send(401);
	else
		next();
};

app.listen(port)