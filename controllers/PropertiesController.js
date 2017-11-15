const Promise = require('bluebird');

function handleNotFound(data) {
    if (!data) {
        let err = new Error('Not found');
        err.status = 404;

        throw err;
    }

    return data;
}

function _handleGetQuery(query) {
    var prop,
    findAllQuery = {},
    between = query.between;

    if (between) {
        between = between.split(',');
        findAllQuery["createdAt"] = {
            $gte: new Date(between[0]),
            $lt: new Date(between[1])
        }
        delete query.between;
    }

    for(prop in query) {
        query[prop] = new RegExp(query[prop], 'gi');
    }

    return Object.assign(findAllQuery, query);
};

function _pricePerArea(data) {
    var pricePerArea;
    let characteristics = data.characteristics;

    if (characteristics) {
        if (characteristics.pricing) {
            let pricing = characteristics.pricing;
            if (pricing.purchase > 0) {
                let sum = pricing.purchase + (pricing.tax || 0) + (pricing.condominium || 0);
                pricePerArea = (characteristics.area) ? sum / characteristics.area : 0;
                return pricePerArea.toFixed(2);
            } else if (pricing.rent > 0) {
                let sum = pricing.rent + (pricing.tax || 0) + (pricing.condominium || 0);
                pricePerArea = (characteristics.area) ? sum / characteristics.area : 0;
                return pricePerArea.toFixed(2);
            }
        }
    }

    return 0;
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


class PropertiesController {
    constructor(model) {
        this.model = Promise.promisifyAll(model);
    }

    getAll(req, res, next) {
        let query = _handleGetQuery(req.query);
        
        this.model.findAsync(query)
        .then(data => {
            let response = {};
            response.length = data.length;
            response.results = data;
            response.mediumPricePerArea = _mediumPricePerArea(response);
            
            res.json(response);
        })
        .catch(next);
    }

    getById(req, res, next) {
        let _id = req.params._id;

        this.model.findOneAsync(_id)
        .then(handleNotFound)
        .then(data => {
            let response = data;
            if (response.characteristics) {
                let characteristics = response.characteristics;
                let query = response.location ? { 'location.district': response.location.district } : {};

                if (characteristics.pricePerArea) {
                    this.model.findAsync(query)
                    .then(finded => {
                        let medium = {};
                        medium.length = finded.length;
                        medium.results = finded;
                        medium.mediumPricePerArea = _mediumPricePerArea(medium);

                        let calcRatio = (characteristics.pricePerArea - medium.mediumPricePerArea)/medium.mediumPricePerArea * 100;

                        response = response.toObject();
                        response.characteristics.mediumPricePerAreaDistrict = medium.mediumPricePerArea.toFixed(2); 
                        response.characteristics.pricePerAreaDistrictVariation = calcRatio.toFixed(2); 

                        console.log(response);

                        res.json(response);
                    })
                    .catch(next);

                    return;
                }
            }

            res.json(response);
        })
        .catch(next);
    }

    create(req, res, next) {
        let body = req.body;

        body['createdAt'] = new Date();
        body['updatedAt'] = new Date();

        if (body.characteristics) {
            body.characteristics.pricePerArea = _pricePerArea(body);
        }

        this.model.createAsync(body)
        .then(data => {
            res.json(data);
        })
        .catch(next);
    }

    update(req, res, next) {
        let _id = req.params._id;
        let body = req.body;

        body['updatedAt'] = new Date();

        this.model.updateAsync(_id, body)
        .then(function(data) {
            res.json(data);
        })
        .catch(next);
    }

    delete(req, res, next) {
        let _id = req.params._id;

        this.model.removeAsync(_id)
        .then(function(data) {
            res.json(data);
        })
        .catch(next);
    }
}

module.exports = function(model) {
    return new PropertiesController(model);
};
