
var mongoose 	= require('mongoose')
	,async		= require('async')
  	,User 		= mongoose.model('User')
  	,Camera		= mongoose.model('Camera')
  	,cameraMgmt = require('../controllers/camera'); 


 //Check whether an account exists and display index 
exports.displayHome = function(req, res) {
	User.findOne({'email': /@/} ,function(err, user) {
    		if (err)
    		{
                return done(err);
        	}
            // if no user is found, return false
            if (!user) {
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
}

//Display configuration page
exports.configurepage = function(req, res) {

	async.parallel(
	    {
	        cameras: function(callback){
	        	// Fetch all cameras in the system
	        	cameraMgmt.getAll(function (err, results) {
	        		callback(err, results);
	        	});
	        }
	    }, 
	    function(e, r){
	        res.render('configure', {
					user : req.user,
					cameras: r.cameras,
					page_title: 'Configure' 
				});
	    }
	);

}

