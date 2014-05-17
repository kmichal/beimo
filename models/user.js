// model/user.js

var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        username     : String,   
        email        : String,
        password     : String,
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

//Check whether there is an account created
userSchema.methods.accountExists = function() {
    this.findOne({'local.email': '*' }, function(err, user) {

            if (err)
            {
                return done(err);
            }
            // if no user is found, return the message
            if (!user)
            {
                return false; 
            }
            else if(user)
            {
                return true;
            }
        });
}


// create the model for users and expose it to our app
mongoose.model('User', userSchema);