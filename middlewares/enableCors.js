const cors = require('cors');
const environment = process.env.NODE_ENV || 'local';
const whiteList = require('../config/default.json')[environment]['cors'];


let EnableCors = function(permissions) {
	let corsOptions = this.setOptions(permissions);

	return cors(corsOptions);
};

EnableCors.prototype.setOptions = function(permissions) {
	if (permissions == 'allow all') {
		whiteList = [];
	}

	return {
		origin: function(origin, callback) {
			if (whiteList.indexOf(origin) > -1 || whiteList.length == 0) {
				callback(null, true);
			} else {
				callback(new Error('You aren\'t allowed to access this endpoint.'));
			}
		}
	};
};

module.exports = function(permissions) {
	return new EnableCors(permissions);
};
