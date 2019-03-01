const Review = require('../models/review');
const User = require('../models/user');
const Game = require('../models/game');
const request = require('request');
module.exports = {
    create,
    show
};

function create(req, res, next) {
    var review = new Review({
      content: req.body.content,
      rating: req.body.rating
    });

    review.save(function(err){
        if (err) return next(err);
        next(null, review);
    });
    console.log("BODDDDYYYYYY: ", req.user);

    console.log("REVIEW: ", req.user._id);

    if (req.user) {

      User.findOne({twitchId: req.user.data[0].id}, function(err, user) {
        if (err) return next (err)
        if (user) {
          user.reviews = review._id;
          user.save(function(err) {
            res.redirect(`/users/${user.id}`);
        });
        }
    });
    }
    res.redirect(req.get('referer'));

}

// api call
// 'https://www.giantbomb.com/api/search/?api_key=c37d39d390487fc87c7fc7ab9d386e61d414df75&format=json&query='
function show(req,res, done) {
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
          done(null, body);
        } else {
            console.log('aBODY: ', body);
          done(body);
        }
        res.render('users/show', {user: req.user || null, gameData: JSON.parse(body).results})

      });
      }