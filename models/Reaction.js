const mongoose = require('mongoose');
const { Schema } = mongoose;

const reactionSchema = new Schema({
    _id: String,        
    english_text: String,
    spanish_text: String ,
    video_link: String,
    facebook_video_link: String,
    tutor:  String,
    trigger:  String
});

mongoose.model('reactions', reactionSchema);