// model/camera.js

var mongoose = require('mongoose')
	, utils = require('../config/utils');

// define the schema for our user model
var cameraSchema = mongoose.Schema({
        nickname	: String,
        ipaddress	: String,
        camusername	: String,
        campassword	: String,
        usingMotion	: {type: Boolean, default: false},
        motioncamid     : Number,
        motionDir	: String,
        liveMotion	: {type: Boolean, default: false},
        liveimgUrl	: String,
        uploadUsername: String,
        uploadPassword: String 
});

cameraSchema.methods.genUploadCreds = function () {
		var self = this;

		self.uploadUsername = utils.randomString(11);
		self.uploadPassword = utils.randomString(28);
	}



// create the model for cameras and expose it to our app
mongoose.model('Camera', cameraSchema);