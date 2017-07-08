"use stricts";
var express = require('express');
var db = require("../data/db.js");
var sms = require("../models/sms.js");
var newChat = require("../models/newchat.js");
var async = require('async');
var router = express.Router();
var pg = require('pg');
var svodka = require('../libs/svodka')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/", function(req, res, next) {
  var ip = req.connection.remoteAddress;
    var event = req.body.event;
    var lastNews = function () {
      return "Введите 'Последнее', чтобы получить пять последних новостей"
    }

    if(event == "user/unfollow") {
    	var userId = req.body.data.id;
    	db.destroy({where:{userId: userId}}).then(function(err) {
        console.log("db destroyed");
      });
    }
    if(event == "user/follow") {
      var userId = req.body.data.id;
      db.create({userId: userId, ip: ip}).then(function(user) {
        console.log("user follows");
        newChat(userId, ip, function(err, res, body) {
          var chatId = body.data.id;
          var message = "Здравствуйте!Я буду присылать вам самые свежие новости. " + lastNews();
          sms(message, chatId, ip);
        })
      });
    }
    if(event == "message/new") {
      var userId = req.body.data.sender_id;
      db.find({where: {userId: userId}})
      .then(function(user) {
      	var content = req.body.data.content;
      	var chatId = req.body.data.chat_id;
      	if(req.body.data.type != 'text/plain') {
      		console.log(errMessage);
      		sms(errMessage, chatId, ip);
      		return;
      	}
        var errMessage = "Некорректный ввод. " + lastNews();
        if(content == "Последнее") {
          var message = "Вот последние пять новостей.";
          sms(message, chatId, ip, function() {
            setTimeout(function() {
              svodka.All().then((news) =>{
                sms(news, chatId, ip,function() {
                  setTimeout(function() {
                    sms(lastNews(), chatId, ip);
                  }, 3000);
                });
              })
            }, 1000);
          })
        }
        else {
          console.log(errMessage);
      		sms(errMessage, chatId, ip);
        }
     })
    }
  res.end();
});



module.exports = router;
