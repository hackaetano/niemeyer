'use strict';

let mongoose = require('mongoose'),
	environment = process.env.NODE_ENV || 'local',
	configMongo = require('../config/default.json')[environment]['mongo'];

function _connection() {
	let username = configMongo.username,
		password = configMongo.password,
		server = configMongo.server,
		port = configMongo.port,
		database = configMongo.database,
		auth = username ? username + ':' + password + '@' : '';

	return 'mongodb://' + auth + server + ':' + port + '/' + database;
}

mongoose.connect(_connection());

let db = mongoose.connection;

db.on('error', function(err) {
	console.log(err);
});

db.once('open', function(callback) {
	console.log('connected to mongodb');
});

module.exports = mongoose;