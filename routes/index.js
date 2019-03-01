var express = require('express');
var router = express.Router();
var passport = require('passport');
var OAuth25Strategy = require('passport-oauth').OAuth2Strategy;
var request = require('request');
var reviewCtrl = require('../controllers/reviews');
var User = require('../models/user')


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { gameData: null, user: req.user ||null });
});


router.get('/show', reviewCtrl.show);

router.post('reviews/:id', reviewCtrl.create);

router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.post('/allusers', function(req, next) {
 User.find({}, function(err, users) {
   console.log(users)
   return users
 })
});

router.post('/', function(req, res) {
  var options = {
    url: `http://www.giantbomb.com/api/search/?api_key=${process.env.GIANTBOMB_TOKEN}&format=json&query="${req.body.gamename}"&resources=game`,
    headers: {
      'User-Agent': 'jim-clark',
      'Authorization': 'api_key ' + process.env.GIANTBOMB_TOKEN}
    }
   request(
    options,
    function(err, response, body) {
      res.render('index', {gameData: JSON.parse(body), user: req.user||null});

  });      
});


router.get('/auth/twitch', passport.authenticate('twitch', { scope: 'user_read' }));
router.get('/auth/twitch/callback', passport.authenticate('twitch', { successRedirect: '/', failureRedirect: '/' }));
module.exports = router;
