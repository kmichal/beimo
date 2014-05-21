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


// create the model for cameras and expose it to our app
mongoose.model('Camera', cameraSchema);