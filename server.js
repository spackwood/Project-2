var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
require('dotenv').config();
require('./config/database');
var User = require("./models/user");
var methodOverride = require('method-override');
//Twitch 
var session = require('express-session');
var passport = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var request = require('request');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var reviewsRouter = require('./routes/reviews');
var gamesRouter = require('./routes/games');

var app = express();
app.use(session({secret: process.env.SESSION_SECRET, resave: false, saveUninitialized:false}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser());
app.use(methodOverride('_method'))

app.use(passport.initialize());
app.use(passport.session());

app.use('/reviews', reviewsRouter);
app.use('/', gamesRouter);
app.use('/', usersRouter);

// Override passport profile function to get user profile from Twitch API
OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
  var options = {
    url: 'https://api.twitch.tv/helix/users',
    method: 'GET',
    headers: {
      'Client-ID': process.env.TWITCH_CLIENT_ID,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': 'Bearer ' + accessToken
    }
  };

  request(options, function (error, response, body) {
    if (response && response.statusCode == 200) {
      done(null, JSON.parse(body));
    } else {
      done(JSON.parse(body));
    }
  });
}

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use('twitch', new OAuth2Strategy({
    authorizationURL: 'https://id.twitch.tv/oauth2/authorize',
    tokenURL: 'https://id.twitch.tv/oauth2/token',
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    state: true
  },
  function(accessToken, refreshToken, profile, done) {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;

//     // Securely store user profile in your DB
    User.findOne({twitchId: profile.data[0].id}, function(err, user) {

     if (err)  return done(err);

     if (user) {
       console.log("USER: ", user);
        return  done(null, user);
     }
     else {
       var newUser = new User({
        twitchId: profile.data[0].id,
        profile_image_url: profile.data[0].profile_image_url,
        display_name: profile.data[0].display_name,
        broadcaster_type: profile.data[0].broadcaster_type
       });

       newUser.save(function(err) {
         if (err)  done(err);
         return done(null,newUser)
       });
     }
      
    });
console.log('profile: ', profile)
    done(null, profile);
  }
));

// Set route to start OAuth link, this is where you define scopes to request


// Set route for OAuth redirect



  // view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
