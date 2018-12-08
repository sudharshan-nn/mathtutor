var express = require('express');
const keys = require('../config/keys');
const reactions = require('../config/reactions')
var URL = require('url');
var router = express.Router();
const mongoose = require('mongoose');
const Reaction = mongoose.model('reactions');



function buildResponseFromReaction(reaction){
    attachment = {"type": "video", "payload": {"url": reaction.video_link}}
    messages = [{"attachment": attachment}]
    return {"messages" : messages}
}

/* GET tutor intro  video*/
router.get('/tutor_intro', function(req, res, next) {
    var query = URL.parse(req.url,true).query;
  
    if (query.email !== undefined){
      console.log("Getting tutor intro video for user: " + query.email)

      var reactionKey = keys.reactionKeyTutorIntro


      console.log(reactionKey)

      console.log(reactions["tutorIntro"])
      var response = buildResponseFromReaction(reactions["tutorIntro"])
      res.send(response)

    } else {
      res.send("Email is required");
    }
    
  });


  module.exports = router; 