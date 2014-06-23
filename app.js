var express = require('express')
  , mongoose = require('mongoose')
  , passport = require('passport');


//Load configuration file
var config = require('./config/config.js');

//Load models
require('./models/user');
require('./models/camera');
require('./models/eventfile');

//Initialize passport
require('./config/passport')(passport);


var app = express();


//Connect to our database
mongoose.connect(config.dburl, config.mongooseextra); 

//Output mongoose errors to console
mongoose.connection.on('error', function (err) {
  console.log(err)
})

//Reconnect when disconnected
mongoose.connection.on('disconnected', function () {
  mongoose.connect(config.dburl, config.mongooseextra); 
})


//Load express config
require('./config/express.js')(app, config, passport);

require('./config/routes.js')(app, passport, mongoose);



app.listen(config.port, function() {
  console.log('Express server listening on port ' + config.port);
});



