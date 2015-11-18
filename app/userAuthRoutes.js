var OsceUsers = require('./models/osceusers.js');
var uuid = require('node-uuid'); 

module.exports = function(app, passport, transporter){

	app.post('/login', passport.authenticate('local'), function(req, res){
		console.log("login success!")
		res.json(req.user);
	});

	//Check if user has logged in
	app.get('/loggedin', function(req,res){
		res.json(req.isAuthenticated() ? req.user : '0');
	});

	app.post('/register', function(req, res){
		OsceUsers.findOne({email:req.body.email}, function(err, user){
			if (user) {
				res.json("This email has been used. Please use another!");
				return;
			}
			if (!user) {
				var token = uuid.v4();
				var newUser = new OsceUsers(req.body);
				newUser.token = token;
				newUser.practices = 0;
				newUser.emailverified = false;
				newUser.save(function(err,user){
					req.login(user,function(err){
						if(err){return next(err)}
						res.json(user);
					});
				});
				console.log(newUser+" added!");
				sendVerEmail(req, newUser);
			}
		});
		
	});

	app.get('/logout', function(req, res){
		req.logOut(); // This is a function by Passport.
						//Passport invalidates cookie
		console.log("Logout completed");
		res.redirect('/');
	});

	app.delete('/profile/:id', function(req, res){
		var id = req.params.id;
		Results.remove({studentid:id}, function(err, result){
			if (err) return err;
			console.log(result)
		});
		OsceUsers.remove({_id:id}, function(err, user){
			if (err) return err;
			res.json("Result & User deleted!");
		});
	});

	app.post('/profile/:id', function(req, res){
		var id = req.params.id;
		var update = req.body;
		console.log(update);
		OsceUsers.update({_id:id}, {
			username: update.username,
			email: update.email,
			password: update.password,
			role: [update.role]
		}, function(err, user){
			if (err) return err;
			OsceUsers.findOne({_id:id}, function(err, user){
				if (err) return err;
				res.json(user);
			});		
		});
	});
	//Passport codes end

	//Email verification

	function sendVerEmail(req, user){
		host=req.get('host');
		link="http://"+req.get('host')+"/verify?id="+user.token;
		mailOptions = {
			from: 'osce247@gmail.com',
			to: user.email,
			subject: "Welcome to Osce-247! Please confirm your email account",
			html: "<p>Hello "+user.username+"!</p> <p>Please click on the link to verify your email.</p><br><a href="+link+">Click here to verify</a><br><p>Thank you!</p><p>Regards,</p><p>iOsce Team</p>"
		}
		console.log(mailOptions);
		transporter.sendMail(mailOptions, function(error, response){
			if (error){
				console.log("Error in sending verification email: "+error);
			} else {
				console.log("Message sent:"+response.message);
			}
		});
	};

	app.get('/verify', function(req,res){
		console.log(req.protocol+":/"+req.get('host'));
		if((req.protocol+"://"+req.get('host'))==("http://"+host)){
			console.log("Domain is matched. Information is from Authentic email");
			console.log(req.query.id);
			OsceUsers.update({token: req.query.id}, {emailverified: true}, 
				function(err, raw){
				if (err) return console.log("Email not verified: "+err);
				res.redirect('/#/login');
			})    
		} else {
			res.end("<h3>Request is from unknown source");
		}
	});

	app.post('/forgotpassword', function(req,res){
		console.log("Request password from: "+req.body.email);
		OsceUsers.findOne({email: req.body.email}, function(err, user){
			if (user) {
				forgotpwdEmail(user)
				res.end("Please check your email for password")
			} else {
				res.end("Email not recognised");
			}
		})
	});

	function forgotpwdEmail(user){
		mailOptions = {
			from: 'osce247@gmail.com',
			to: user.email,
			subject: "Forgot password",
			html: "<p>Hello "+user.username+"!</p> <ul><li>Email: "+user.email+"</li><li>Password: "+user.password+"</li></ul>"
		}
		console.log(mailOptions);
		transporter.sendMail(mailOptions, function(error, response){
			if (error){
				console.log("Error in sending forgotpwd email: "+error);
			} else {
				console.log("Message sent");
			}
		});
	};

	//Email verification ends
}