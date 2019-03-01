var mongoose = require('mongoose')
var Schema = mongoose.Schema

var reviewSchema = new Schema({
    content: String,
    rating: {type: Number, min: 1, max: 5, default: 5}
}, {
    timestamps: true
});

var userSchema = new mongoose.Schema({
    twitchId: String,
    profile_image_url: String,
    display_name: String,
    broadcaster_type: String,
    reviews: {
        type: Schema.Types.ObjectId,
        ref: "Reviews"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);