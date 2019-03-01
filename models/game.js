var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
    gbGuid: String,

}, {
    timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);