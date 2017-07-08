var Sequelize = require("sequelize");
var sequelize = new Sequelize("d4htj1p8ihjld1", "mmwdayzfohzhtu", "ee2475e4bc126de91605ac37cf91e6f787b284aba745e88834a08c257c1c7c84", {
	host: "ec2-54-247-120-169.eu-west-1.compute.amazonaws.com",
	dialect: "postgres"
});

var user = sequelize.define("user", {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	userId: Sequelize.INTEGER,
	ip: Sequelize.STRING,
	state: {
		type: Sequelize.BOOLEAN,
	    defaultValue: true
	},
	subscribed: {
		type: Sequelize.BOOLEAN,
			defaultValue:false
	}
})

user.sync().then(function() {});



module.exports = user;
