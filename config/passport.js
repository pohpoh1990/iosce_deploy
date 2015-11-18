var LocalStrategy = require('passport-local').Strategy;

var OsceUsers = require('../app/models/osceusers');

module.exports = function(passport){
	passport.serializeUser(function(user, done){
		done(null, user);
	});

	passport.deserializeUser(function(id, done){
		OsceUsers.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use(new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
		},
		function(username, password, done) {
			process.nextTick(function(){
				OsceUsers.findOne({email:username, password:password}, function(err, user) {
					if (err) {return done(err);}
					if (!user) {
						return done(null, false, {message: "Username or password does not exist."});
					}
				    return done(null, user);
				});
			})	    
		}
	));

}