/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User');


//Display configuration form
exports.configureform = function(req, res) {
	res.render('configure', {
		user : req.user,
		page_title: 'Configure' 
	});
}

//Display account creation form
exports.createaccountform = function(req, res){
  res.render('create_account', { 
    user: req.user, 
    signupMessage: req.flash('signupMessage'),
    page_title: 'Create Account'  
  });
}

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/')
}



//Check whether an account exists and display index 
exports.displayHome = function(req, res) {
	User.findOne({'email': /@/} ,function(err, user) {
    		if (err)
    		{
                return done(err);
        	}
            // if no user is found, return false
            if (!user) {
            	//console.log('false');
            	//return false;
            	res.redirect('/createaccount');
            }
            if (user)
            {
              res.render('index', { 
      					user: req.user, 
      					page_title: 'Home' 
  				    });
            }
        });
	//res.redirect('/');
}

exports.accountCheck = function (req, res, cb)
{
  User.findOne({'email': /@/} ,function(err, user) {
        if (err)
        {
                return done(err);
          }
            // if no user is found, return false
            if (!user) {
              //console.log('false');
              //return false;
              res.redirect('/createaccount');
            }
            if (user)
            {
              cb;
            }
        });
}