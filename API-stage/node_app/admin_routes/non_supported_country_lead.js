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
    const {country, ip_address, gps_location, email} = req.body;

let query = {country: country, ip_address: ip_address, gps_location: gps_location, email: email};

db.NonSupportedCountryLead.create(query)
    .then(countryLead => {
    res.send(countryLead);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, (req, res, next) => {
    db.NonSupportedCountryLead.findAll({where: {}})
    .then((countries) => {
    res.send(countries)
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, (req, res, next) => {
    db.NonSupportedCountryLead.findOne({where: {
    id: req.params['id']
}})
    .then((country) => {
    res.send(country)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUser, (req, res, next) => {
    const {country, ip_address, gps_location, email} = req.body;
db.NonSupportedCountryLead.findOne({where: {id: req.params['id']}})
    .then((countryLead) => {
    if(!countryLead) return next(new Errors.Validation("countryLead is not existed"));
countryLead.country = country;
countryLead.ip_address = ip_address;
countryLead.gps_location = gps_location;
countryLead.email = email;
countryLead.save()
    .then(countryLead => res.send(countryLead));
})
.catch(err => next(err));
});


router.delete('/:id', middlewares.validateAdminUser, (req, res, next) => {
    db.NonSupportedCountryLead.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
