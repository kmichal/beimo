// model/camera.js

var mongoose = require('mongoose');

// define the schema for our user model
var cameraSchema = mongoose.Schema({
        cameraid	: Number,
        nickname	: String,
        ipaddress	: String,
        camusername	: String,
        campassword	: String,
        usingMotion	: {type: Boolean, default: false},
        motionDir	: String,
        liveMotion	: {type: Boolean, default: false},
        liveimgUrl	: String
});


// create the model for cameras and expose it to our app
mongoose.model('Camera', cameraSchema);