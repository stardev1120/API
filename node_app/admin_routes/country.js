'use strict'
const db = require('../models');
const geoip = require('geoip-lite');
const randomstring = require('randomstring');
const helper = require('../helper');
const auth = require('../helper/auth');
const Errors = require('../errors');
const middlewares = require('../middlewares');
const router = require('express').Router();
const dictionary = require('../dictionary.json');
const _ = require('lodash')

router.post('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {name, country_code, status} = req.body;

let query = {name: name, country_code: country_code, status: status};

db.Country.create(query)
    .then(country => {
    res.send(country);
})
.catch(err => res.send({err: err.message}))
});

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);
const user=req.user;

    db.Country.findAll(filter_1)
    .then((countries) => {
var lookup = _.map(JSON.parse(JSON.stringify(user.AdminuserCountries)), function(country){return country.Country.name+'-'+country.Country.country_code})

var countries_filtered = _.filter(countries, function(country){
return _.indexOf(lookup, country.name+'-'+country.country_code)>=0;
});
    res.send(countries_filtered);

})
.catch(err => next(err));
});

router.get('/count', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);

    db.Country.findAll({where:filter_1.where})
    .then((countries) => {
        res.send({count:countries.length})
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.Country.findOne({where: {
        id: req.params['id']
    },
include:[
    {
        model: db.CountrySetting
    }
]})
    .then((country) => {
    res.send(country)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {name, country_code, status} = req.body;
db.Country.findOne({where: {id: req.params['id']}})
    .then((country) => {
    if(!country) return next(new Errors.Validation("country is not existed"));
country.name = name;
country.country_code = country_code;
country.status = status;
country.save()
    .then(country => res.send(country));
})
.catch(err => next(err));
});
/*

router.delete('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.Country.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});*/


module.exports = router;
