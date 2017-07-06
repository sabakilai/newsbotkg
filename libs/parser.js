var AWS = require('aws-sdk');
AWS.config.loadFromPath('./bucket.json');
var s3 = new AWS.S3();
var Xray = require('x-ray');
var x = Xray({
  filters: {
    replace: function (value) {
      return typeof value === 'string' ? value.replace(/(?:\r\n|\r|\n|\t|\\)/g, "").trim() : value}}
});

module.exports = function (url, main, title, link, file){
  return new Promise(function (resolve, reject) {
    x(url, main, [{
    title: title,
    link: link
    }])
    (function (err,data) {
      var params = {
          Bucket: 'newsbotkg',
          Key: file,
          Body: JSON.stringify(data[0])
      };
      s3.putObject(params, function (perr, pres) {
          if (perr) {
              console.log('bad');
              reject( perr);
          } else {
              console.log('good');
              resolve('Added '+ file +' file');
          }
      });
    })
  })
}
