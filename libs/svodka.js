"use strict"
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./bucket.json');
var s3 = new AWS.S3();


module.exports = {
  One(file) {
    return new Promise((resolve,reject)=>{
      var params = {
          Bucket: 'newsbotkg',
          Key: file
      };
      s3.getObject(params, function(err, data) {
        if (err) {
          console.log(err);
          reject(err);
        }
        var news = JSON.parse(data.Body.toString()) ;
        var result = news.title + '\n' + news.link;
        resolve(result);
      })
    });
  },
  All() {
    Promise.all([
      svodkaOne('knews.json'),
      svodkaOne('azattyk.json'),
      svodkaOne('sputnik.json'),
      svodkaOne('24.json'),
      svodkaOne('kloop.json')
    ]).then((news) =>{
      var result = news[0] + '\n' + news[1] + '\n' + news[2] + '\n' + news[3] + '\n' + news[4];
      console.log(result);
    })
  }
};
