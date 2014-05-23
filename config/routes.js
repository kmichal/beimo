
var util = require('util');
var userMgmt = require('../controllers/user');
var cameraMgmt = require('../controllers/camera');
var appMgmt = require('../controllers/application');

var utils = require('./utils');

module.exports = function(app, passport, mongoose) {

//@TODO Add auth requirement
app.get('/', appMgmt.displayHome); 


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





app.get('/configure',  appMgmt.configurepage);
//, utils.ensureAuthenticated




//Camera operations
//@TODO Add require login
app.param('cameraid', cameraMgmt.load);
app.post('/camera/add', cameraMgmt.add);

app.get('/camera/delete/:cameraid', cameraMgmt.delete);





app.get('/live/img/:cameraid', cameraMgmt.getLiveImg); 






app.get('/logout', userMgmt.logout);






























}