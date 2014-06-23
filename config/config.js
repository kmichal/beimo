var path = require('path');
module.exports = {
	port: '3000',
	dburl: 'mongodb://localhost:27017/beimo',
	mongooseextra: {
		server: { socketOptions: { keepAlive: 1 } }
	},
	sessionsecret: "keyboard cat",
	imagepath: function () {
		return path.dirname(require.main.filename) + '/camera_images/';
	}
}