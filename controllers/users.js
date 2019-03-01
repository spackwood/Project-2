const User = require('../models/user');

module.exports = {
    index
};

function index(req, res, next) {

  User.find(modelQuery)
  .sort(sortKey).exec(function(err, users) {
    if (err) return next(err);
    // Passing search values, name & sortKey, for use in the EJS
    res.render('users/index', {
      user,
      user: req.user || null,
      name: req.query.name,
      sortKey
    });
  });
}
