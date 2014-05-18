
var mongoose = require('mongoose')
  , User = mongoose.model('User');

exports.ensureAuthenticated = function(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
	//  res.redirect('/login')
	User.findOne({'email': /@/} ,function(err, user) {
			if (err)
			{
	            return done(err);
	    	}
	        // if no user is found, redirect to creation form
	        if (!user) {
	        	res.redirect('/createaccount');
	        }
	        //Account exists, redirect to login form
	        if (user)
	        {
	        	res.redirect('/login');

	        }
	});
}