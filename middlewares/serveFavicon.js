'use strict';

var serveFavicon = function(req, res, next) {
	if (req.url == '/favicon.ico') {
		res.writeHead(200, {'Content-Type': 'image/x-icon'});
		res.end('');
	} else {
		next();
	}
};

module.exports = serveFavicon;
