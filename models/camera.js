// model/camera.js

var mongoose = require('mongoose');

// define the schema for our user model
var cameraSchema = mongoose.Schema({
        cameraid	: Number,
        nickname	: String,
        ipaddress	: String,
        camusername	: String,
        campassword	: String,
        usingMotion	: Boolean,
        motionDir	: String,
        liveMotion	: Boolean,
        liveimgUrl	: String
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
mongoose.model('Camera', cameraSchema);