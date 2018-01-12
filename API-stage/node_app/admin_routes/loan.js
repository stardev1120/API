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


router.post('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {date_taken, amount_taken, service_fee, interest_rate, duration_of_loan, status, amount_pending,
        bank_credit_transaction, bank_credit_status, currency, user_id, user_payment_method_id} = req.body;

let query = {
    date_taken: date_taken,
    amount_taken: amount_taken,
    service_fee: service_fee,
    interest_rate: interest_rate,
    duration_of_loan: duration_of_loan,
    status: status,
    amount_pending: amount_pending,
    bank_credit_transaction: bank_credit_transaction,
    bank_credit_status: bank_credit_status,
    currency: currency,
    user_id: user_id,
    user_payment_method_id: user_payment_method_id};

db.Loan.create(query)
    .then(loan => {
    res.send(loan);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id}=req.headers;
    const {user_id, offset, limit}=req.query;
    var filterCountry = {
    }
    if(country_id){
        filterCountry.id = country_id
    }
    var filter={}
    if(user_id){
        filter.user_id = user_id
    }
var include = [
    {
        model: db.User,
        where: filter,
        include: [{
            model:db.Country,
            where:filterCountry
        }]
    },

    {
        model: db.UserPaymentMethod
    },
    ];
if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields&&req.user.Role.FeatureACLs[0].fields['COLLECTION']){
    include.push({
        model: db.Collection
    })
}
    db.Loan.findAll({offset: offset*1, limit: limit*1, where: {},
    include:include
    })
    .then((loans) => {
    res.send(loans)
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id}=req.headers;
var include = [
    {
        model: db.User,
        include: [{
            model:db.Country,
            where: {id: country_id}
        }]
    },

    {
        model: db.UserPaymentMethod
    },
];
if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields&&req.user.Role.FeatureACLs[0].fields['COLLECTION']){
    include.push({
        model: db.Collection
    })
}
    db.Loan.findOne({where: {
    id: req.params['id']
},
    include:include})
    .then((loan) => {
    res.send(loan)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {date_taken, amount_taken, service_fee, interest_rate, duration_of_loan, status, amount_pending,
        bank_credit_transaction, bank_credit_status, currency, user_id, user_payment_method_id} = req.body;

db.Loan.findOne({where: {id: req.params['id']}})
    .then((loan) => {
    if(!loan) return next(new Errors.Validation("loan is not existed"));
loan.date_taken = date_taken;
loan.amount_taken = amount_taken;
loan.service_fee = service_fee;
loan.interest_rate = interest_rate;
loan.duration_of_loan = duration_of_loan;
loan.status = status;
loan.amount_pending = amount_pending;
loan.bank_credit_transaction = bank_credit_transaction;
loan.bank_credit_status = bank_credit_status;
loan.currency = currency;
loan.user_id = user_id;
loan.user_payment_method_id = user_payment_method_id;

loan.save()
    .then(loan => res.send(loan));
})
.catch(err => next(err));
});


router.delete('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.Loan.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
