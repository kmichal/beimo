
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


function encryptString(text){
  var cipher = crypto.createCipher('aes-256-cbc','Lf9Jk7EVGR%@oeEUFGylgzNrobFvA/GWllMULGJH7qD6I')
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decryptString(text){
  var decipher = crypto.createDecipher('aes-256-cbc','Lf9Jk7EVGR%@oeEUFGylgzNrobFvA/GWllMULGJH7qD6I')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}