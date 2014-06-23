
var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , crypto = require('crypto');

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


exports.encryptString = function(text){
  var cipher = crypto.createCipher('aes-256-cbc','Lf9Jk7EVGR%@oeEUFGylgzNrobFvA/GWllMULGJH7qD6I')
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
exports.decryptString = function(text){
  var decipher = crypto.createDecipher('aes-256-cbc','Lf9Jk7EVGR%@oeEUFGylgzNrobFvA/GWllMULGJH7qD6I')
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

exports.randomString = function(howMany, chars) {
  chars = chars 
      || "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
  var rnd = crypto.randomBytes(howMany)
      , value = new Array(howMany)
      , len = chars.length;

  for (var i = 0; i < howMany; i++) {
      value[i] = chars[rnd[i] % len]
  };

  return value.join('');
}

exports.getFilenameFromHeader = function(hstring) {
  
  var regPattern = /"(.*?)"/;
  regMatch = regPattern.exec(hstring);

  if(regMatch[1].indexOf("/") > -1)
  {
    var fnArray = regMatch[1].split("/");
    return fnArray.pop();

  }
  else
  {
    return regMatch[1];
  }
}