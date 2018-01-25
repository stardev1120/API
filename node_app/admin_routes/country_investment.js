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


router.post('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth , (req, res, next) => {
    const {amount_available, status, country_id, loan_id} = req.body;

let query = {amount_available: amount_available, status: status, country_id: country_id, loan_id: loan_id};

db.CountryInvestment.create(query)
    .then(countryInvestment => {
    res.send(countryInvestment);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
   const {country_id} = req.headers;
    const {offset, limit}=req.query;
   db.CountryInvestment.findAll({offset: offset*1, limit: limit*1, where: {},
include:[
    {
        model: db.Country,
        where: {id: country_id}
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

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id} = req.headers;
    db.CountryInvestment.findOne({where: {
    id: req.params['id']
},
    include:[
        {
            model: db.Country,
            where: {id: country_id}
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

router.put('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
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


router.delete('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.CountryInvestment.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
