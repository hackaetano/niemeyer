const Promise = require('bluebird');

function _handleNotFound(data) {
    if (!data) {
        let err = new Error('Not found');
        err.status = 404;

        throw err;
    }

    return data;
}

function _mediumPricePerArea(data) {
    let sum = 0;

    if (!data.length) {
        return 0;
    }

    for(var prop in data.results) {
        let item = data.results[prop];
        if (item.characteristics) {
            let pricePerArea = item.characteristics.pricePerArea || 0;
            if (pricePerArea) {
                sum = sum + pricePerArea;
            }
        }
    }

    return sum / data.length;
}

class MatchesController {
    constructor(user, property) {
        this.user = Promise.promisifyAll(user);
        this.property = Promise.promisifyAll(property);
    }

    getMatches(req, res, next) {
        let _id = req.params._id;

        this.user.findOneAsync(_id)
        .then(_handleNotFound)
        .then(this.parseUser)
        .then(this.buildQuery)
        .then(query => {
            console.log(query);
            this.property.findAsync(query)
            .then(data => {
                let response = {};
                response.length = data.length;
                response.results = data;
                response.mediumPricePerArea = _mediumPricePerArea(response);
                
                res.json(response);
            })
            .catch(next);
        })
        .catch(next);
    }

    parseUser(data) {
        data = data.toObject();

        let userToMatch = {};
        userToMatch.location = data.preferences.neighborhood.settings.district[0];
        userToMatch.children = data.familiar.children.has;
        userToMatch.income = data.personal.income;

        return userToMatch;
    }

    buildQuery(data) {
        let query = {};
        query.features = {};
        query.features.essencials = {};
        query.characteristics = {};

        query.location = {};

        if (data.children) {
            query.features.essencials.rooms = {
                $gt: 1
            }
        } else {
            delete query.features;
        }

        if (data.district) {
            query.location.district = new RegExp(data.district, 'gi');
        } else {
            delete query.location;
        }

        if (data.income) {
            query.characteristics.pricing = {};
            query.characteristics.pricing.rent = {
                $lt: data.income * 0.4
            }
        } else {
            delete  query.characteristics
        }

        return query;
    }
}

module.exports = function(user, property) {
    return new MatchesController(user, property);
};
