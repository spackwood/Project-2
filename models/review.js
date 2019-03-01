var mongoose = require('mongoose')
var Schema = mongoose.Schema

const reviewSchema = new Schema({
    content: String,
    rating: {type: Number, min: 1, max: 5, default: 5}
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);