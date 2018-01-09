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
    const {amount_available, status, country_id, loan_id} = req.body;

let query = {amount_available: amount_available, status: status, country_id: country_id, loan_id: loan_id};

db.CountryInvestment.create(query)
    .then(countryInvestment => {
    res.send(countryInvestment);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, (req, res, next) => {
    db.CountryInvestment.findAll({where: {},
include:[
    {
        model: db.Country
    },

    {
        model: db.Loan
    }
]})
    .then((countryInvestments) => {
    res.send(countryInvestments)
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, (req, res, next) => {
    db.CountryInvestment.findOne({where: {
    id: req.params['id']
},
    include:[
        {
            model: db.Country
        },

        {
            model: db.Loan
        }
    ]})
    .then((countryInvestment) => {
    res.send(countryInvestment)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUser, (req, res, next) => {
    const {amount_available, status, country_id, loan_id} = req.body;
db.CountryInvestment.findOne({where: {id: req.params['id']}})
    .then((countryInvestment) => {
    if(!countryInvestment) return next(new Errors.Validation("countryInvestment is not existed"));
countryInvestment.amount_available = amount_available;
countryInvestment.status = status;
countryInvestment.country_id = country_id;
countryInvestment.loan_id = loan_id;
countryInvestment.save()
    .then(countryInvestment => res.send(countryInvestment));
})
.catch(err => next(err));
});


router.delete('/:id', middlewares.validateAdminUser, (req, res, next) => {
    db.CountryInvestment.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
