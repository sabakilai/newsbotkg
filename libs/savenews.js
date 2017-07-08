var AWS = require('aws-sdk');
AWS.config.loadFromPath('./bucket.json');
var s3 = new AWS.S3();

module.exports = function (file, data){
  return new Promise(function (resolve, reject) {
    var params = {
            Bucket: 'newsbotkg',
            Key: file,
            Body: data
        }
    s3.putObject(params, function (perr, pres) {
        if (perr) {
            reject("Error uploading data: ", perr);
        } else {
            resolve('Added sputnik.json file ');
        }
        });
  })
}
