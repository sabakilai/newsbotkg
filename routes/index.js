"use stricts";
var express = require('express');
var db = require("../data/db.js");
var sms = require("../models/sms.js");
var new_sms = require("../models/new_sms.js");
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
    var commandAll = function (subscribed) {
      return "Введите 'Последнее', чтобы получить пять последних новостей. \n Введите 'Подписка', чтобы " + (subscribed ? "отключить" : "включить")  + " автоматическую рассылку новостей."
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
          var message = "Здравствуйте!Я буду присылать вам самые свежие новости. " + commandAll(subscribed);
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
        var subscribed = user.subscribed;
        console.log(subscribed);
      	if(req.body.data.type != 'text/plain') {
      		console.log(errMessage);
      		sms(errMessage, chatId, ip);
      		return;
      	}
        var errMessage = "Некорректный ввод. " + commandAll(subscribed);
        if(content == "Последнее") {
          var message = "Вот последние пять новостей.";
          sms(message, chatId, ip, function() {
            setTimeout(function() {
              Promise.all([
                svodka.One('sputnik.json'),
                svodka.One('24.json'),
                svodka.One('kloop.json'),
                svodka.One('azattyk.json'),
                svodka.One('knews.json')
              ]).then((output)=>{
                console.log(output);
                sms(output[0], chatId, ip, function() {
                setTimeout(function() {
                  sms(output[1], chatId, ip,function() {
                    setTimeout(function() {
                      sms(output[2], chatId, ip,function () {
                        setTimeout(function () {
                          sms(output[3],chatId,ip,function () {
                            setTimeout(function () {
                              sms(output[4],chatId,ip,function () {
                                setTimeout(function () {
                                  sms(commandAll(subscribed),chatId,ip)
                                },500)
                              })
                            },500)
                          })
                        },500)
                      });
                    }, 500);
                  });
                }, 500);
              })
              }).catch((error)=>{
                console.log(error);
              })
            }, 1000);
          })
        }
        else if (content == "Подписка") {
            if(subscribed) {
             db.update({subscribed: false}, {where: {userId: userId}}).then(function(user) {
               let message = "Вы отключили рассылку новостей. "+commandAll(!subscribed);
               sms(message, chatId, ip);
             })
           } else {
             db.update({subscribed: true}, {where: {userId: userId}}).then(function(user) {
               let message = "Вы включили рассылку новостей. "+commandAll(!subscribed);
               sms(message, chatId, ip);
             })
           }
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
