// model/eventfile.js

var mongoose = require('mongoose');

// define the schema for our user model
var eventFileSchema = mongoose.Schema({
		cameraid	: { type : mongoose.Schema.ObjectId, ref : 'Camera' },
        time		: Date,
        filename	: String
});



// create the model for event files (images) and expose it to our app
mongoose.model('EventFile', eventFileSchema);