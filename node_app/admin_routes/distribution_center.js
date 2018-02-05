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


router.post('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth , (req, res, next) => {
    const {country_id, company_id, address, lat, long, contact_number} = req.body;
let query = {country_id: country_id, company_id: company_id, address: address, lat: lat, long: long, contact_number: contact_number};

db.DistributionCenter.create(query)
    .then(distributionCenter => {
    res.send(distributionCenter);
    next();
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id} = req.headers;
var filterCountry = {
}
if(country_id){
    filterCountry.id = country_id
}
    const {offset, limit}=req.query;
db.DistributionCenter.findAll({offset: offset*1, limit: limit*1, where: {},
    include: [{
        model: db.Country,
        where: filterCountry
    },{
        model: db.Company
    }]})
    .then((companies) => {
    res.send(companies)
})
.catch(err => next(err));
});

router.get('/company/count', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    //const {country_id} = req.headers;
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);
    db.DistributionCenter.findAll({where: filter_1.where})
    .then((distributionCenter) => res.send({count:distributionCenter?distributionCenter.length:0}))
.catch(err => next(err));
});

router.get('/company', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    //const {country_id} = req.headers;
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);
    db.DistributionCenter.findAll({offset: filter_1.offset, limit: filter_1.limit, where: filter_1.where ,
    include: [{
        model: db.Country,
        //where: {id: country_id}
    },{
        model: db.Company
    }]})
    .then((distributionCenter) =>res.send(distributionCenter))
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    //const {country_id} = req.headers;
    db.DistributionCenter.findOne({where: {id: req.params['id']} ,
    include: [{
        model: db.Country,
        //where: {id: country_id}
    },{
        model: db.Company
    }]})
    .then((distributionCenter) => {
    res.send(distributionCenter)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
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


router.delete('/company/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.DistributionCenter.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
