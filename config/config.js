module.exports = {
	port: '3000',
	dburl: 'mongodb://localhost:27017/wmuser',
	mongooseextra: {
		server: { socketOptions: { keepAlive: 1 } }
	},
	sessionsecret: "keyboard cat"
}