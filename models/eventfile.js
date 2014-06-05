// model/eventfile.js

var mongoose = require('mongoose');

// define the schema for our user model
var eventFileSchema = mongoose.Schema({
        cameraid	: Number,
        time		: Date,
        filename	: String
});

/*
// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}
*/

// create the model for cameras and expose it to our app
mongoose.model('EvenFile', eventFileSchema);