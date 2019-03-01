const Review = require('../models/review');
const User = require('../models/user');
const Game = require('../models/game');
const request = require('request');

module.exports = {
    new: newGame,
    show,
    create
};

function newGame(req,res,next) {
    var review = new Review(req.body);
    review.save(function(err) {
      if (err) return next(err);
      return next(null,review);
    });
}

function show(req,res,next) {
    var url = 'https://www.giantbomb.com/api/search/?api_key=c37d39d390487fc87c7fc7ab9d386e61d414df75&format=json&query='
    var options = {
        url: url + req.params.name,
        method: 'GET',
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          "user-agent": "jim-clarke",
          'Accept': 'application/vnd.twitchtv.v5+json'
        }
      };
    
      request(options, function (error, response, body) {
        if (response && response.statusCode == 200) {
          next(null, body);
        } else {
            console.log('aBODY: ', body);
          next(body);
        }
        var reviews = null;
        Review.find({}, function(err,review) {
          if (err) return next(err);
          reviews = review
          
          res.render('users/showGame', {user: req.user || null, gameData: JSON.parse(body).results[0]}, reviews);
          return next(null,reviews);

        });
        res.render('users/showGame', {user: req.user || null, gameData: JSON.parse(body).results[0]}, reviews)

      });
}

function create(req, res) {
  var review = new Review(req.body);

  review.save(function(err){
      if (err) return next(err);
      next(null, review);
  });
  res.redirect(req.get('referer'));

}