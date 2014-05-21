
var util = require('util');
var userMgmt = require('../controllers/user');
var cameraMgmt = require('../controllers/camera');

var utils = require('./utils');

module.exports = function(app, passport, mongoose) {

app.get('/', utils.ensureAuthenticated,userMgmt.displayHome); 

  /*function(req, res){
  if(userMgmt.accountExists){
    res.render('index', { 
  	 user: req.user, 
  	 page_title: 'Home' });
  }
  else
  {
    res.redirect('/createaccount');
  }
});
*/


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

app.get('/createaccount', userMgmt.createaccountform);

app.post('/createaccount',
  passport.authenticate('local-signup', { 
    failureRedirect: '/createaccount', failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  });





app.get('/configure', userMgmt.configureform);
//, utils.ensureAuthenticated




//Camera operations
app.post('/camera/add', cameraMgmt.add);




app.get('/logout', userMgmt.logout);






























}