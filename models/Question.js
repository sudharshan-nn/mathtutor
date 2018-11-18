const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
  _id: String,
  question_image_link: String,
  question_audio_link: String,
  answer_audio_link: String,
  answer_options: Array,
  correct_answer: String,
  hints:[{_id:String, position:Number, hint_audio_link:String}]
});

mongoose.model('questions', questionSchema);