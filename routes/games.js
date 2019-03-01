var express = require('express');
var router = express.Router();
var gamesCtrl = require('../controllers/games');

router.get('/games/new', gamesCtrl.new);


module.exports = router;