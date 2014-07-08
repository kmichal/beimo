var express = require('express')
  , bodyParser = require("body-parser")
  , methodOverride = require("method-override")
  , morgan = require("morgan")
  , session = require('express-session')
  , cookieParser = require('cookie-parser')
  , flash = require('connect-flash');;




module.exports = function (app, config, passport) {

  app.set('views', __dirname + '/../views');
  app.set('view engine', 'ejs');
  app.engine('ejs', require('ejs-locals'));
  app.use(morgan());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(session({ secret: config.sessionsecret , 
                 	saveUninitialized: true,
                 	resave: true}));
  app.use(flash());
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(__dirname + '/../public'));


}
