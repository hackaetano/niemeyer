'use strict';

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, source) {
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = mergeDeep(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}


class PropertiesModel {
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

        this.model.findOne(query).exec(user => {
            if (user) {
                var user = mergeDeep(user, data);
            } else {
                var user = data;
            }

            this.model.update(query, user).exec(function(err, result, rows) {
                callback(err, result, rows);
            });
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
    let Property = mongoose.model('Property', {
        source: {
            name: String,
            code: {
                type: String,
                unique: true
            },
            url: String
        },
        characteristics: {
            title: String,
            description: String,
            categories: [String],
            propertyType: String,
            images: [String],
            area: Number,
            pricing: {
                purchase: Number,
                rent: Number,
                condominium: Number,
                tax: Number
            },
            pricePerArea: Number
        },
        location: {
            zipcode: String,
            street: String,
            number: Number,
            district: String,
            city: String,
            state: String,
            country: String,
            geolocation: {
                latitude: Number,
                longitude: Number
            }
        },
        features: {
            essencials: {
                rooms: Number,
                suites: Number,
                bathrooms: Number,
                kitchens: Boolean,
                serviceArea: Boolean,
                parkingSpace: Number
            },
            amenities: {
                all: [String]
            }
        },
        createdAt: Date,
        updatedAt: Date
    });

    return new PropertiesModel(Property);
};
