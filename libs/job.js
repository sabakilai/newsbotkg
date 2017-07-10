var svodka = require('./svodka');
var parser = require('./parser');
var savenews = require('./savenews');
var async = require('async');
var db = require('../data/db.js');
var new_sms = require("../models/new_sms.js");
var newChat = require("../models/newchat.js");

function checkChanges() {
  return new Promise((resolve,reject)=>{
    Promise.all([
      svodka.Raw('sputnik.json'),
      svodka.Raw('24.json'),
      svodka.Raw('kloop.json'),
      svodka.Raw('azattyk.json'),
      svodka.Raw('knews.json')
    ]).then((files)=>{
      Promise.all([
        parser('https://ru.sputnik.kg/Kyrgyzstan/','.b-stories__item','.b-stories__title h2','a@href'),
        parser('https://24.kg/','.one','.title','.title a@href', '24.json'),
        parser('https://kloop.kg/news/','.td-block-span12','.item-details h3','.item-details a@href'),
        parser('https://rus.azattyk.org/z/3734','.media-block','h4','.content a@href'),
        parser('http://knews.kg/','.td-block-span4','h3','a@href')
      ]).then((parsers) =>{
          var file;
          var tosend = [];
          for (var i = 0; i < 5; i++) {
            switch (i) {
              case 0: file = 'sputnik.json'; break;
              case 1: file = '24.json'; break;
              case 2: file = 'kloop.json'; break;
              case 3: file = 'azattyk.json'; break;
              case 4: file = 'knews.json'; break;
            }
            if (files[i].link!=parsers[i].link) {

              savenews(file, JSON.stringify(parsers[i]));
              console.log('New ' + file + ' file');
              tosend.push(file)
            }
          }
          resolve(tosend);
        }).catch((error) =>{
          reject('Error parsing: ' + error);
        })
      }).catch((error)=>{
        reject('Error reading files: ' + error);
      })
  })
};

module.exports = function() {
  db.findAll({where: {subscribed: true }}).then((results) => {
    async.each(results,function (result,callback) {
      checkChanges().then((tosend) => {
        if (tosend.length > 0) {
          var userId = result.userId;
          var ip = result.ip;
          var news = [];
          var messages = [];
          for (var i = 0; i < tosend.length; i++) {
            news.push(svodka.One(tosend[i]))
          }
          Promise.all(news).then((output)=>{
            newChat(userId, ip, function(err, res, body) {
              if(body.data) {
                var chatId = body.data.id;
              }
              for (var i = 0; i < output.length; i++) {
                messages.push(new_sms(output[i],chatId,ip));
              }
              Promise.all(messages).then((datas) => {
                console.log(datas);
              }).catch((error)=>{
                console.log(error);
              })
            })
          }).catch((error) => {
            console.log(error);
          })
        }else {
          console.log('Nothing to send.');
        }

      })
    })
  })
}
