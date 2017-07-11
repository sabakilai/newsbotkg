var Xray = require('x-ray');
var x = Xray({
  filters: {
    replace: function (value) {
      return typeof value === 'string' ? value.replace(/(?:\r\n|\r|\n|\t|\\)/g, "").trim() : value}}
});

module.exports = function (url, main, title, link){
  return new Promise(function (resolve, reject) {
    x(url, main, [{
    title: title + ' | replace',
    link: link
    }])
    (function (err,data) {
      if (err) {
        reject(err);
      }
      if (data[0] == 'undefined') {
        console.log('undefined url - ' + url);
        resolve('undefined');
      }

      resolve((data[0]))
    })
  })
}
