var x = require('x-ray')();
var AWS = require('aws-sdk');
AWS.config.loadFromPath('../bucket.json');
var s3 = new AWS.S3();

module.exports = function (url, main, title, link, file){
  return new Promise(function (resolve, reject) {
    x(url, main, [{
    title: title,
    link: link
    }])
    (function (err,data) {
      data = data.slice(0, 1)
      var params = {
          Bucket: 'newsbotkg',
          Key: file,
          Body: data
      };
      s3.putObject(params, function (perr, pres) {
          if (perr) {
              reject("Error uploading data: ", perr);
          } else {
              resolve('Added '+ file +' file');
          }
      });
    })
  })
}
