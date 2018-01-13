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
var filter={};
if(user_id){
    filter.user_id = user_id
}
var include = [];
var attributes=[]
if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields){
    if(req.user.Role.FeatureACLs[0].fields['COLLECTION'] || req.user.Role.FeatureACLs[0].fields['ALL']){
        include.push({
            model: db.Collection
        })
    }
    if(req.user.Role.FeatureACLs[0].fields['USER'] || req.user.Role.FeatureACLs[0].fields['ALL']){
        include.push({
            model: db.User,
            where: filter,
            include: [{
                model:db.Country,
                where:filterCountry
            }]
        })
    }

    if(req.user.Role.FeatureACLs[0].fields['UserPaymentMethod'] || req.user.Role.FeatureACLs[0].fields['ALL']){
        include.push(
            {
                model: db.UserPaymentMethod
            })
    }

    if(req.user.Role.FeatureACLs[0].fields['ALL']){
        attributes=['id', 'date_taken', 'amount_taken', 'service_fee', 'interest_rate', 'duration_of_loan', 'status', 'amount_pending',
            'bank_credit_transaction', 'bank_credit_status', 'currency']
    } else {
        if (req.user.Role.FeatureACLs[0].fields['id']) {
            attributes.push('id');
        }
        if(req.user.Role.FeatureACLs[0].fields['date_taken'] ){
            attributes.push('date_taken');
        }
        if(req.user.Role.FeatureACLs[0].fields['amount_taken'] ){
            attributes.push('amount_taken');
        }
        if(req.user.Role.FeatureACLs[0].fields['service_fee'] ){
            attributes.push('service_fee');
        }
        if(req.user.Role.FeatureACLs[0].fields['interest_rate'] ){
            attributes.push('interest_rate');
        }
        if(req.user.Role.FeatureACLs[0].fields['duration_of_loan'] ){
            attributes.push('duration_of_loan');
        }
        if(req.user.Role.FeatureACLs[0].fields['status'] ){
            attributes.push('status');
        }
        if(req.user.Role.FeatureACLs[0].fields['amount_pending'] ){
            attributes.push('amount_pending');
        }
        if(req.user.Role.FeatureACLs[0].fields['bank_credit_transaction'] ){
            attributes.push('bank_credit_transaction');
        }
        if(req.user.Role.FeatureACLs[0].fields['bank_credit_status'] ){
            attributes.push('bank_credit_status');
        }
        if(req.user.Role.FeatureACLs[0].fields['currency']){
            attributes.push('currency');
        }
    }
}
db.Loan.findAll({attributes: attributes, offset: offset*1, limit: limit*1, where: {},
    include:include
})
    .then((loans) => {
    res.send(loans)
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id}=req.headers;

var filterCountry = {
}
if(country_id){
    filterCountry.id = country_id
}
var include = [];
var attributes=[];
if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields){
    if(req.user.Role.FeatureACLs[0].fields['COLLECTION'] || req.user.Role.FeatureACLs[0].fields['ALL']){
        include.push({
            model: db.Collection
        })
    }
    if(req.user.Role.FeatureACLs[0].fields['USER'] || req.user.Role.FeatureACLs[0].fields['ALL']){
        include.push({
            model: db.User,
            include: [{
                model:db.Country,
                where:filterCountry
            }]
        })
    }

    if(req.user.Role.FeatureACLs[0].fields['UserPaymentMethod'] || req.user.Role.FeatureACLs[0].fields['ALL']){
        include.push(
            {
                model: db.UserPaymentMethod
            })
    }
    if(req.user.Role.FeatureACLs[0].fields['ALL']){
        attributes=['id', 'date_taken', 'amount_taken', 'service_fee', 'interest_rate', 'duration_of_loan', 'status', 'amount_pending',
            'bank_credit_transaction', 'bank_credit_status', 'currency', 'user_id']
    } else {
        if (req.user.Role.FeatureACLs[0].fields['id']) {
            attributes.push('id');
        }
        if(req.user.Role.FeatureACLs[0].fields['date_taken']){
            attributes.push('date_taken');
        }
        if(req.user.Role.FeatureACLs[0].fields['amount_taken']){
            attributes.push('amount_taken');
        }
        if(req.user.Role.FeatureACLs[0].fields['service_fee']){
            attributes.push('service_fee');
        }
        if(req.user.Role.FeatureACLs[0].fields['interest_rate']){
            attributes.push('interest_rate');
        }
        if(req.user.Role.FeatureACLs[0].fields['duration_of_loan']){
            attributes.push('duration_of_loan');
        }
        if(req.user.Role.FeatureACLs[0].fields['status']){
            attributes.push('status');
        }
        if(req.user.Role.FeatureACLs[0].fields['amount_pending']){
            attributes.push('amount_pending');
        }
        if(req.user.Role.FeatureACLs[0].fields['bank_credit_transaction']){
            attributes.push('bank_credit_transaction');
        }
        if(req.user.Role.FeatureACLs[0].fields['bank_credit_status']){
            attributes.push('bank_credit_status');
        }
        if(req.user.Role.FeatureACLs[0].fields['currency']){
            attributes.push('currency');
        }
    }
}
db.Loan.findOne({attributes:attributes, where: {
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

if(req.user.Role.FeatureACLs[0].fields['date_taken'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.date_taken = date_taken;
}
if(req.user.Role.FeatureACLs[0].fields['amount_taken'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.amount_taken = amount_taken;
}
if(req.user.Role.FeatureACLs[0].fields['service_fee'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.service_fee = service_fee;
}
if(req.user.Role.FeatureACLs[0].fields['interest_rate'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.interest_rate = interest_rate;
}
if(req.user.Role.FeatureACLs[0].fields['duration_of_loan'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.duration_of_loan = duration_of_loan;
}
if(req.user.Role.FeatureACLs[0].fields['status'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.status = status;
}
if(req.user.Role.FeatureACLs[0].fields['amount_pending'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.amount_pending = amount_pending;
}
if(req.user.Role.FeatureACLs[0].fields['bank_credit_transaction'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.bank_credit_transaction = bank_credit_transaction;
}
if(req.user.Role.FeatureACLs[0].fields['bank_credit_status'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.bank_credit_status = bank_credit_status;
}
if(req.user.Role.FeatureACLs[0].fields['currency'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.currency = currency;
}
if(req.user.Role.FeatureACLs[0].fields['user_id'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.user_id = user_id;
}
if(req.user.Role.FeatureACLs[0].fields['user_payment_method_id'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.user_payment_method_id = user_payment_method_id;
}

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
