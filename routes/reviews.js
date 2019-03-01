var express = require('express');
var router = express.Router();
var reviewsCtrl = require('../controllers/reviews');
var gameCtrl = require('../controllers/games');


router.get('/:name/show', reviewsCtrl.show);
router.get('/:name/game', gameCtrl.show);
router.get('/:name/reviews', gameCtrl.create);
router.post('/:id', reviewsCtrl.create);

module.exports = router;