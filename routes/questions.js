var express = require('express');
const keys = require('../config/keys');
var URL = require('url');
var router = express.Router();
const mongoose = require('mongoose');
const Question = mongoose.model('questions');

var questions = [
  '{"messages":[{"text":"What is 2 * 5","quick_replies":[{"title":"2","url":"https://18.222.251.97:3000/questions/answer?ans=2&qus=1","type":"json_plugin_url"},{"title":"5","url":"https://18.222.251.97:3000/questions/answer?ans=5&qus=1","type":"json_plugin_url"},{"title":"3","url":"https://18.222.251.97:3000/questions/answer?ans=3&qus=1","type":"json_plugin_url"},{"title":"10","url":"https://18.222.251.97:3000/questions/answer?ans=10&qus=1","type":"json_plugin_url"}]}]}',
  '{"messages":[{"text":"What is 15 % 6","quick_replies":[{"title":"2","url":"https://18.222.251.97:3000/questions/answer?ans=2&qus=2","type":"json_plugin_url"},{"title":"5","url":"https://18.222.251.97:3000/questions/answer?ans=5&qus=2","type":"json_plugin_url"},{"title":"3","url":"https://18.222.251.97:3000/questions/answer?ans=3&qus=2","type":"json_plugin_url"},{"title":"10","url":"https://18.222.251.97:3000/questions/answer?ans=10&qus=2","type":"json_plugin_url"}]}]}',
  '{"messages":[{"text":"What is 5 * 11","quick_replies":[{"title":"55","url":"https://18.222.251.97:3000/questions/answer?ans=55&qus=3","type":"json_plugin_url"},{"title":"5","url":"https://18.222.251.97:3000/questions/answer?ans=5&qus=3","type":"json_plugin_url"},{"title":"46","url":"https://18.222.251.97:3000/questions/answer?ans=45&qus=3","type":"json_plugin_url"},{"title":"10","url":"https://18.222.251.97:3000/questions/answer?ans=10&qus=3","type":"json_plugin_url"}]}]}',
  '{"messages":[{"text":"What is 2^3","quick_replies":[{"title":"24","url":"https://18.222.251.97:3000/questions/answer?ans=24&qus=4","type":"json_plugin_url"},{"title":"12","url":"https://18.222.251.97:3000/questions/answer?ans=12&qus=4","type":"json_plugin_url"},{"title":"8","url":"https://18.222.251.97:3000/questions/answer?ans=8&qus=4","type":"json_plugin_url"},{"title":"4","url":"https://18.222.251.97:3000/questions/answer?ans=4&qus=4","type":"json_plugin_url"}]}]}',
  '{"messages":[{"text":"2 + 3 * 5","quick_replies":[{"title":"25","url":"https://18.222.251.97:3000/questions/answer?ans=25&qus=5","type":"json_plugin_url"},{"title":"12","url":"https://18.222.251.97:3000/questions/answer?ans=12&qus=5","type":"json_plugin_url"},{"title":"17","url":"https://18.222.251.97:3000/questions/answer?ans=17&qus=5","type":"json_plugin_url"},{"title":"4","url":"https://18.222.251.97:3000/questions/answer?ans=4&qus=5","type":"json_plugin_url"}]}]}'

]

var answers = ['10', '3', '55', '8', '17']

var users = {}

function getQustionsList(count){
  var list = [];
  for (var i = 0; i <= keys.questionsCount; i++) {
      list.push(i);
  }

  for (var i = list.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }

  return list.slice(0,count)

}


function prepareQuestionResponse(question, email){
  // var question_object = JSON.parse(question)
  // for(i = 0; i < question_object.messages[0].quick_replies.length; i++){
  //   question_object.messages[0].quick_replies[i].url = question_object.messages[0].quick_replies[i].url + "&email=" + email 
  // }

  // return JSON.stringify(question_object)
  return question
}

function buildQuickReplies(question, hint){
  var quick_replies = []
  question.answer_options.forEach(element => {
    url = keys.awsUrl + "/questions/submit_answer?" + "ans=" + element + "&qus=" + question._id
    quick_replies.push({"title":element, "url": url, "type": "json_plugin_url"})
  });
  if(question.hints.length > 0 && hint < question.hints.length) {
    url = keys.awsUrl + "/questions/hint?" + "hint=" + (hint+1) + "&qus=" + question._id
    quick_replies.push({"title": hint===0?"Hint":"Next Hint", "url": url, "type": "json_plugin_url"})
  }
  return quick_replies;
}

function builtHint(question, hint){
  var attachment  = {"type":"audio", "payload":{ url: question.hints[hint-1].hint_audio_link }}
  var quick_replies = {"text":"Choose an Answer" ,"quick_replies": buildQuickReplies(question, hint)}
  var response  = {"messages": [{'attachment':attachment}, quick_replies]}
  return response
}

function buildResponseFromQuestion(question, hint){
  var attachment = {"type":"image", "payload": {"url": question.question_image_link}}
  var quick_replies = {"text":"Choose an Answer" ,"quick_replies": buildQuickReplies(question, hint)}
  var response  = {"messages": [{'attachment':attachment}, quick_replies]}

  return response
}

function buildHintResponseFromQuestion(question, hint){
  var attachment  = {"type":"audio", "payload":{ url: question.hints[hint-1].hint_audio_link }}
  var quick_replies = {"text":"Choose an Answer" ,"quick_replies": buildQuickReplies(question, hint)}
  var response  = {"messages": [{'attachment':attachment}, quick_replies]}
  return response
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


/* GET users listing. */
router.get('/first_question', function(req, res, next) {
  var query = URL.parse(req.url,true).query;

  // Get Random Question List
  var questionList = getQustionsList(10)

  if (query.email !== undefined){
    // if (!users.hasOwnProperty(email))
    users[query.email] = {'questions_attemped':0, "questions_correct":0, "question_list": questionList, "total_hints": 0}
    console.log(users[query.email].question_list)
    var questionKey = "problem_" + users[query.email].question_list.pop()
    questionKey = "problem_" + 205
    console.log(questionKey)
    var query = Question.findOne({_id: questionKey})
    query.exec(function(err, question){
      if(err)
        console.log("unable to fetch the question", err)
      var response = buildResponseFromQuestion(question, 0)
      console.log(response)
      res.send(response)
      
    });
  } else {
    res.send("Email is required");
  }
  
});

router.get('/hint', function(req, res, next) {
  var urlParms = URL.parse(req.url,true).query;


  if (urlParms.email !== undefined){
    // if (!users.hasOwnProperty(email))
    console.log(urlParms)

    var query = Question.findOne({_id:urlParms.qus})
    query.exec(function(err, question){
      if(err)
        console.log("unable to fetch the question", err)
      console.log(urlParms)
      var response = buildHintResponseFromQuestion(question, parseInt(urlParms.hint))
      
      // console.log(users[urlParms.email])
      users[urlParms.email].total_hints = users[urlParms.email].total_hints + 1
      console.log(response)
      res.send(response)
      
    });
  } else {
    res.send("Email is required");
  }
  
});


router.get('/submit_answer', function(req, res, next){
  var urlParms = URL.parse(req.url,true).query;;
  question_index = parseInt(urlParms.qus)
  email = urlParms.email
  console.log("users answers is: " + urlParms.ans + " question: " + urlParms.qus);

  var query = Question.findOne({_id:urlParms.qus})

  query.exec(function(err, question){
    if(err)
      console.log("unable to fetch the question", err)

    console.log(question)
    if (urlParms.ans === question.correct_answer) {
      users[email].questions_attemped = users[email].questions_attemped + 1;
      users[email].questions_correct = users[email].questions_correct + 1;
    } else {
      users[email].questions_attemped = users[email].questions_attemped + 1;
    }


    if (users[email].questions_attemped < 3){
      var questionKey = "problem_" + users[urlParms.email].question_list.pop()
      questionKey = "problem_" + 205
  
      var query = Question.findOne({_id: questionKey})
      query.exec(function(err, question){
        if(err)
          console.log("unable to fetch the question", err)
        
        console.log(question)
        var response = buildResponseFromQuestion(question, 0)
        console.log(response)
        res.send(response)
        
      });
    } else {
      res.send({"messages":[{"text":"Thanks for compleating the test, you did attempt " 
      + users[email].questions_attemped + " questions and got " 
      + users[email].questions_correct + " correctly and total hints used: "
      + users[email].total_hints }]})
    }

  });
});

router.post('/add', function(req, res, next){
  console.log("creating Questions")
  var question = new Question();
  question._id = 'problem_205'
  question.question_image_link= "https://s3.amazonaws.com/mathspring-content/mscontent-min-20180118/html5Probs/problem_205/media/problem_205.png"
  question.question_audio_link= "https://s3.amazonaws.com/mathspring-content/mscontent-min-20180118/html5Probs/problem_205/media/question.mp3"
  question.answer_audio_link= "https://s3.amazonaws.com/mathspring-content/mscontent-min-20180118/html5Probs/problem_205/media/answer.mp3"
  question.answer_options= ["A", "B", "C", "D", "E"]
  question.correct_answer= "E"
  question.hints= [
    {
    _id: "problem_205_hint_1a",
    position: 1,
    hint_audio_link: "https://s3.amazonaws.com/mathspring-content/mscontent-min-20180118/html5Probs/problem_205/media/hint1a.mp3"
    },
      {
    _id: "problem_205_hint_1b",
    position: 2,
    hint_audio_link: "https://s3.amazonaws.com/mathspring-content/mscontent-min-20180118/html5Probs/problem_205/media/hint1b.mp3"
    },
      {
    _id: "problem_205_hint_2",
    position: 3,
    hint_audio_link: "https://s3.amazonaws.com/mathspring-content/mscontent-min-20180118/html5Probs/problem_205/media/hint2.mp3"
    },
      {
    _id: "problem_205_hint_3",
    position: 4,
    hint_audio_link: "https://s3.amazonaws.com/mathspring-content/mscontent-min-20180118/html5Probs/problem_205/media/hint3.mp3"
    },
      {
    _id: "problem_205_hint_4",
    position: 5,
    hint_audio_link: "https://s3.amazonaws.com/mathspring-content/mscontent-min-20180118/html5Probs/problem_205/media/hint4.mp3"
    },
      {
    _id: "problem_205_hint_5",
    position: 6,
    hint_audio_link: "https://s3.amazonaws.com/mathspring-content/mscontent-min-20180118/html5Probs/problem_205/media/hint5.mp3"
    },
    {
    _id: "problem_205_hint_6",
    position: 7,
    hint_audio_link: "https://s3.amazonaws.com/mathspring-content/mscontent-min-20180118/html5Probs/problem_205/media/hint6.mp3"
    },
    {
    _id: "problem_205_hint_7",
    position: 8,
    hint_audio_link: "https://s3.amazonaws.com/mathspring-content/mscontent-min-20180118/html5Probs/problem_205/media/hint7.mp3"
    }, 
   ]
  //  console.log(question)

   question.save(function(err){
     console.log(err)
   });
  
  // res.send(question)
  res.send("hi")
});

router.get("/random_test", function(req, res, next){
  res.send('{"messages":[{"attachment":{"type":"audio","payload":{"url":"https://s3.amazonaws.com/mathspring-content/mscontent-min-20180118/html5Probs/problem_205/media/hint1a.mp3"}}},{"text":"Choose an Answer","quick_replies":[{"title":"A","url":"https://18.222.251.97:3000/qustions/answer?ans=A&qus=problem_205","type":"json_plugin_url"},{"title":"B","url":"https://18.222.251.97:3000/qustions/answer?ans=B&qus=problem_205","type":"json_plugin_url"},{"title":"C","url":"https://18.222.251.97:3000/qustions/answer?ans=C&qus=problem_205","type":"json_plugin_url"},{"title":"D","url":"https://18.222.251.97:3000/qustions/answer?ans=D&qus=problem_205","type":"json_plugin_url"},{"title":"E","url":"https://18.222.251.97:3000/qustions/answer?ans=E&qus=problem_205","type":"json_plugin_url"},{"title":"Next Hint","url":"https://18.222.251.97:3000/questions/hint?hint=2&qus=problem_205","type":"json_plugin_url"}]}]}')
});

module.exports = router;  