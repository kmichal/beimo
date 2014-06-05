/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User');




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

