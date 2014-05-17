
var util = require('util');


module.exports = function(app, passport, mongoose) {

app.get('/', function(req, res){
  res.render('index', { 
  		user: req.user, 
  		page_title: 'Home' });
});

app.get('/account', ensureAuthenticated, function(req, res){
	console.log(util.inspect(req.user));
  res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
	res.render('login', { 
    user: req.user, 
  	loginMessage: req.flash('loginMessage'),
		page_title: 'Login'  
	});
});


app.post('/login',
  passport.authenticate('local-login', { 
  	failureRedirect: '/login', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/configure', ensureAuthenticated, function(req, res) {
	res.render('configure', {
		user : req.user,
		page_title: 'Configure' 
	});
});

app.get('/accountcheck', function(req, res){
	//console.log(util.inspect(module.exports));
	//var User = require('../models/user');

	var User  = mongoose.model('User');
	User.findOne({'local.email': 'mkrasucki@gmail.com'} ,function(err, user) {
    		console.log('in findone funtion');
    		//console.log(util.inspect(user));

    		if (err)
    		{
    			 console.log('error');
                return done(err);
        }
            // if no user is found, return the message
            if (user)
            {
            	console.log(user.local.email);
            }
        });
	console.log('ffsd');
	res.render('index', { 
  		user: req.user, 
  		page_title: 'Home' });

});




// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
/*
app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.flash('error', info.message);
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});
*/

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});















// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}























}