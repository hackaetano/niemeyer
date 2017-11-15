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

class UsersController {
    constructor(model) {
        this.model = Promise.promisifyAll(model);
    }

    getAll(req, res, next) {
        let query = _handleGetQuery(req.query);

        this.model.findAsync(query)
        .then(data => {
            res.json(data);
        })
        .catch(next);
    }

    getById(req, res, next) {
        let _id = req.params._id;

        this.model.findOneAsync(_id)
        .then(handleNotFound)
        .then(data => {
            res.send(data);
        })
        .catch(next);
    }

    create(req, res, next) {
        let body = req.body;

        body['createdAt'] = new Date();
        body['updatedAt'] = new Date();

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
    return new UsersController(model);
};
