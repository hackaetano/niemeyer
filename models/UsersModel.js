'use strict';

class UsersModel {
    constructor(model) {
        this.model = model;
    }

    find(query, callback) {
        this.model
        .find(query)
        .exec(callback);
    }

    findOne(_id, callback) {
        let query = {
            _id: _id
        };

        this.model.findOne(query).exec(callback);
    }

    create(data, callback) {
        let model = new this.model(data);

        model.save(function(err, result, rows) {
            callback(err, result, rows);
        });
    }

    update(_id, data, callback) {
        let query = {
            _id: _id
        };

        this.model.update(query, data).exec(function(err, result, rows) {
            callback(err, result, rows);
        });
    }

    remove(_id, callback) {
        let query = {
            _id: _id
        };

        this.model.remove(query).exec(function(err, result) {
            callback(err, result);
        });
    }
}

module.exports = function(mongoose) {
    let User = mongoose.model('User', {
        personal: {
            name: String,
            email: String,
            birth: Date,
            cpf: String,
            rg: String,
            gender: String,
            occupation: String,
            income: Number,
            cars: {
                has: Boolean,
                howMany: Number
            }
        },
        familiar: {
            maritalStatus: String,
            children: {
                has: Boolean,
                howMany: Number,
                ages: [Number]
            },
            pets: {
                has: Boolean,
                howMany: Number
            }
        },
        credit: {
            cpfStatus: String,
            serasaScore: Number
        },
        preferences: {
            neighborhood: {
                settings: {
                    district: [String],
                    city: String,
                    state: String
                },
                lifeStyle: {
                    work: Number,
                    schools: Number,
                    malls: Number,
                    markets: Number,
                    mobility: Number,
                    health: Number,
                    safety: Number,
                    culture: Number,
                    costOfLife: Number
                }
            },
            property: {
                settings: {
                    type: String,
                    size: Number,
                    pricing: Number,
                    rooms: Number
                },
                lifeStyle: {
                    comfort: Number,
                    utilities: Number,
                    services: Number
                }
            }
        },
        createdAt: Date,
        updatedAt: Date
    });

    return new UsersModel(User);
};
