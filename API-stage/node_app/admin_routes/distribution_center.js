'use strict'
const db = require('../models');
const geoip = require('geoip-lite');
const randomstring = require('randomstring');
const helper = require('../helper');
const auth = require('../helper/auth');
const Errors = require('../errors');
const middlewares = require('../middlewares');
const router = require('express').Router();
const dictionary = require('../dictionary.json')
const sendMail = require('../helper/sendMail');


router.post('/', middlewares.validateAdminUser , (req, res, next) => {
    const {country_id, company_id, address, lat, long, contact_number} = req.body;

let query = {country_id: country_id, company_id: company_id, address: address, lat: lat, long: long, contact_number: contact_number};

db.DistributionCenter.create(query)
    .then(distributionCenter => {
    res.send(distributionCenter);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, (req, res, next) => {
    db.DistributionCenter.findAll({where: {},
    include: [{
        model: db.Country,
        foreignKey:'country_id',
        as: 'country'
    },{
        model: db.Company,
        foreignKey:'company_id',
        as: 'company'
    }]})
    .then((companies) => {
    res.send(companies)
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUserOrSameUser, (req, res, next) => {
    db.DistributionCenter.findOne({where: {id: req.params['id']} ,
    include: [{
        model: db.Country,
        foreignKey:'country_id',
        as: 'country'
    },{
        model: db.Company,
        foreignKey:'company_id',
        as: 'companys'
    }]})
    .then((distributionCenter) => {
    res.send(distributionCenter)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUserOrSameUser, (req, res, next) => {
    const {country_id, company_id, address, lat, long, contact_number} = req.body;
db.DistributionCenter.findOne({where: {id: req.params['id']}})
    .then((distributionCenter) => {
    if(!distributionCenter) return next(new Errors.Validation("Distribution Center not exist"));
distributionCenter.country_id = country_id;
distributionCenter.company_id = company_id;
distributionCenter.address = address;
distributionCenter.lat = lat;
distributionCenter.long = long;
distributionCenter.contact_number = contact_number;
distributionCenter.save()
    .then(user => res.send(distributionCenter));
})
.catch(err => next(err));
});


router.delete('/:id', middlewares.validateAdminUser, (req, res, next) => {
    db.DistributionCenter.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
