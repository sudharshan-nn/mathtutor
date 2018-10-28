var express = require('express');
var URL = require('url');
var router = express.Router();

var questions = [
  '{"messages":[{"text":"What is 2 * 5","quick_replies":[{"title":"2","url":"https://18.222.251.97:3000/questions/answer?ans=2&qus=1","type":"json_plugin_url"},{"title":"5","url":"https://18.222.251.97:3000/questions/answer?ans=5&qus=1","type":"json_plugin_url"},{"title":"3","url":"https://18.222.251.97:3000/questions/answer?ans=3&qus=1","type":"json_plugin_url"},{"title":"10","url":"https://18.222.251.97:3000/questions/answer?ans=10&qus=1","type":"json_plugin_url"}]}]}',
  '{"messages":[{"text":"What is 15 % 6","quick_replies":[{"title":"2","url":"https://18.222.251.97:3000/questions/answer?ans=2&qus=2","type":"json_plugin_url"},{"title":"5","url":"https://18.222.251.97:3000/questions/answer?ans=5&qus=2","type":"json_plugin_url"},{"title":"3","url":"https://18.222.251.97:3000/questions/answer?ans=3&qus=2","type":"json_plugin_url"},{"title":"10","url":"https://18.222.251.97:3000/questions/answer?ans=10&qus=2","type":"json_plugin_url"}]}]}',
  '{"messages":[{"text":"What is 5 * 11","quick_replies":[{"title":"55","url":"https://18.222.251.97:3000/questions/answer?ans=55&qus=3","type":"json_plugin_url"},{"title":"5","url":"https://18.222.251.97:3000/questions/answer?ans=5&qus=3","type":"json_plugin_url"},{"title":"46","url":"https://18.222.251.97:3000/questions/answer?ans=45&qus=3","type":"json_plugin_url"},{"title":"10","url":"https://18.222.251.97:3000/questions/answer?ans=10&qus=3","type":"json_plugin_url"}]}]}',
  '{"messages":[{"text":"What is 2^3","quick_replies":[{"title":"24","url":"https://18.222.251.97:3000/questions/answer?ans=24&qus=4","type":"json_plugin_url"},{"title":"12","url":"https://18.222.251.97:3000/questions/answer?ans=12&qus=4","type":"json_plugin_url"},{"title":"8","url":"https://18.222.251.97:3000/questions/answer?ans=8&qus=4","type":"json_plugin_url"},{"title":"4","url":"https://18.222.251.97:3000/questions/answer?ans=4&qus=4","type":"json_plugin_url"}]}]}',
  '{"messages":[{"text":"2 + 3 * 5","quick_replies":[{"title":"25","url":"https://18.222.251.97:3000/questions/answer?ans=25&qus=5","type":"json_plugin_url"},{"title":"12","url":"https://18.222.251.97:3000/questions/answer?ans=12&qus=5","type":"json_plugin_url"},{"title":"17","url":"https://18.222.251.97:3000/questions/answer?ans=17&qus=5","type":"json_plugin_url"},{"title":"4","url":"https://18.222.251.97:3000/questions/answer?ans=4&qus=5","type":"json_plugin_url"}]}]}'

]

var answers = ['10', '3', '55', '8', '17']

var users = {}

function prepareQuestionResponse(question, email){
  // var question_object = JSON.parse(question)
  // for(i = 0; i < question_object.messages[0].quick_replies.length; i++){
  //   question_object.messages[0].quick_replies[i].url = question_object.messages[0].quick_replies[i].url + "&email=" + email 
  // }

  // return JSON.stringify(question_object)
  return question
}

/* GET users listing. */
router.get('/first', function(req, res, next) {
  var query = URL.parse(req.url,true).query;

  if (query.email !== undefined){
    // if (!users.hasOwnProperty(email))
    users[query.email] = {'questions_attemped':0, "questions_correct":0}
    console.log(users[query.email])
    res.send(prepareQuestionResponse(questions[0], query.email));
  } else {
    res.send(questions[0]);
  }
  
});


router.get('/answer', function(req, res, next){
  var query = URL.parse(req.url,true).query;;
  question_index = parseInt(query.qus)
  email = query.email
  console.log("users answers is: " + query.ans + " question: " + query.qus);
  
  if (query.ans == answers[question_index-1]) {
    users[email].questions_attemped = users[email].questions_attemped + 1;
    users[email].questions_correct = users[email].questions_correct + 1;
  } else {
    users[email].questions_attemped = users[email].questions_attemped + 1;
  }

  console.log(users[email])

  if (question_index < 5){
    res.send(prepareQuestionResponse(questions[question_index]));
  } else {
    res.send({"messages":[{"text":"Thanks for compleating the test, you did attempt " + users[email].questions_attemped + " questions and got " + users[email].questions_correct + " correctly" }]})
  }
});

module.exports = router;