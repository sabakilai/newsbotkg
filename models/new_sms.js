var config = require('../config.js');
var request=require("request");

module.exports=function(message, chatId, ip, callback){
	return new Promise((resolve,reject)=>{
		var token = config.token.production;
	  var url = "https://api.namba1.co/chats/";

		var options={
		url: url + chatId + "/write",
		method:"POST",
		headers:{
			'X-Namba-Auth-Token': token
		},
		body:{
			"type":"text/plain",
			"content":message
		},
		json: true
		}
		request(options, function (err,response, body) {
			if (err) {
				reject(err);
			}
			resolve(body);
		});

	})

};
