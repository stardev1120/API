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


router.post('/', middlewares.validateAdminUser , (req, res, next) => {
    const {name, country_code, status} = req.body;

let query = {name: name, country_code: country_code, status: status};

db.Country.create(query)
    .then(country => {
    res.send(country);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, (req, res, next) => {
    db.Country.findAll({where: {}})
    .then((countries) => {
    res.send(countries)
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, (req, res, next) => {
    db.Country.findOne({where: {
        id: req.params['id']
    },
include:[
    {
        model: db.CountrySetting,
        as: 'countrySettings'
    }
]})
    .then((country) => {
    res.send(country)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUser, (req, res, next) => {
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


router.delete('/:id', middlewares.validateAdminUser, (req, res, next) => {
    db.Country.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
