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
    const {company_name, name, company_address, contact_number, country_id} = req.body;

let query = {company_name: company_name, name: name, company_address: company_address, contact_number: contact_number, country_id: country_id};

db.Company.create(query)
    .then(company => {
    res.send(company);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, (req, res, next) => {
    db.Company.findAll({where: {},
    include: [{
        model: db.Country
    }]})
    .then((companies) => {
    res.send(companies)
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUserOrSameUser, (req, res, next) => {
    db.Company.findOne({where: {id: req.params['id']} ,
    include: [{
        model: db.Country
    }]})
    .then((company) => {
    res.send(company)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUserOrSameUser, (req, res, next) => {
    const {company_name, name, company_address, contact_number, country_id} = req.body;
db.Company.findOne({where: {id: req.params['id']}})
    .then((company) => {
    if(!company) return next(new Errors.Validation("User not exist"));
company.company_name = company_name;
company.name = name;
company.company_address = company_address;
company.contact_number = contact_number;
company.country_id = country_id;
company.save()
    .then(user => res.send(company));
})
.catch(err => next(err));
});


router.delete('/:id', middlewares.validateAdminUser, (req, res, next) => {
    db.Company.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
