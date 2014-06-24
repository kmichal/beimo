
var util = require('util');
var userMgmt = require('../controllers/user');
var cameraMgmt = require('../controllers/camera');
var appMgmt = require('../controllers/application');

var utils = require('./utils');

module.exports = function(app, passport, mongoose) {


app.get('/', utils.ensureAuthenticated, appMgmt.displayHome); 
app.get('/home', utils.ensureAuthenticated, appMgmt.displayHome); 

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





app.get('/configure', utils.ensureAuthenticated, appMgmt.configurepage);




//Camera operations
//@TODO Add require login
app.param('cameraid', cameraMgmt.load);

app.post('/camera/add', utils.ensureAuthenticated, cameraMgmt.add);
app.get('/camera/getconfiguration/:cameraid', utils.ensureAuthenticated, cameraMgmt.getConfigInfo);
app.get('/camera/delete/:cameraid', utils.ensureAuthenticated, cameraMgmt.delete);


app.post('/upload/img', cameraMgmt.addImageAuth);
app.get('/upload/img', cameraMgmt.addImageAuth);

app.post('/upload/img/:cameraid', cameraMgmt.addImageWithToken);


app.get('/live/img/:cameraid', utils.ensureAuthenticated, cameraMgmt.getLiveImg); 




app.get('/logout', userMgmt.logout);






























}