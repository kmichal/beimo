
var mongoose 	= require('mongoose')
	,async		= require('async')
	,disk 		= require('diskspace')
	,config 	= require('../config/config')
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
				        res.render('index', {
								user : req.user,
								cameras: r.cameras,
								camcount: r.cameras.length,
								page_title: 'Home' 
							});
				    }
				);
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
	        },
	        appMountSpace: function(callback){
	        	disk.check(__dirname, function (err, total, free, status)
				{	
					var diskstat = [];
						diskstat["total"] = total/1024/1024
						diskstat["free"] = free/1024/1024;
						diskstat["percentused"] = Math.round(100 - ((diskstat["free"]/diskstat["total"])*100));
						diskstat["percentfree"] = 100- diskstat["percentused"];
						diskstat["status"] = status;

					console.log('percent: ' + diskstat["percentused"] + 'total: ' + total + ' free: ' + free + ' status: ' + status);
				    callback(err, diskstat);
				});
	        },
	        camImagesSpace: function(callback){
	        	disk.check(config.imagepath(), function (err, total, free, status)
				{	
					var diskstat = [];
						diskstat["total"] = total/1024/1024
						diskstat["free"] = free/1024/1024;
						diskstat["percentused"] = Math.round(100 - ((diskstat["free"]/diskstat["total"])*100));
						diskstat["percentfree"] = 100- diskstat["percentused"];
						diskstat["status"] = status;

					console.log('percent: ' + diskstat["percent"] + ' free: ' + free + ' status: ' + status);
				    callback(err, diskstat);
				});
	        }
	    }, 
	    function(e, r){
	        res.render('configure', {
					user : req.user,
					cameras: r.cameras,
					appdiskusage: r.appMountSpace,
					imagesdiskusage: r.camImagesSpace,
					page_title: 'Configure' 
				});
	    }
	);

}

