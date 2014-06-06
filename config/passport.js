
var util = require('util');
// load all the things we need
var mongoose = require('mongoose')
var LocalStrategy   = require('passport-local').Strategy;

var User = mongoose.model('User');

module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findById(id, function (err, user) {
        done(err, user);
      });
    });


    // Use the LocalStrategy within Passport.
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with username and password from our form
            console.log('in login function');
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  email }, function(err, user) {
            console.log('in findone funtion');
            // if there are any errors, return the error before anything else
            if (err)
            {
                console.log('error');
                return done(err);
            }
            // if no user is found, return the message
            if (!user)
            {   console.log('no user found');
                return done(null, false, req.flash('loginMessage', 'Incorrect email or password.')); // req.flash is the way to set flashdata using connect-flash
            }
            // if the user is found but the password is wrong
            if (!user.validPassword(password))
            {   console.log('wrong password');
                return done(null, false, req.flash('loginMessage', 'Incorrect email or password.')); // create the loginMessage and save it to session as flashdata
            }
            // all is well, return successful user
            console.log('everything ok');
            return done(null, user);
        });

    }));

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            process.nextTick(function () {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                    User.findOne({ 'email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {

                        if(password != req.body.password2)
                        {
                            return done(null, false, req.flash('signupMessage', 'Passwords do not match.'));
                        }
                        else{
                            // if there is no user with that email
                            // create the user
                            var newUser            = new User();

                            // set the user's local credentials
                            newUser.email    = email;
                            newUser.password = newUser.generateHash(password); // use the generateHash function in our user model

                            // save the user
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    }

                    });

            });
        }));

}