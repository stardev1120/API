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
    const {amount, date, currency, retry_date, status} = req.body;

let query = {
    amount: amount,
    date: date,
    currency: currency,
    retry_date: retry_date,
    status: status};

db.Collection.create(query)
    .then(collection => {
    res.send(collection);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {offset, limit}=req.query;
var attributes=[];
if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields){
    if(req.user.Role.FeatureACLs[0].fields['ALL']){
        attributes=['id', 'amount', 'date', 'currency', 'retry_date', 'status']
    } else {
        if (req.user.Role.FeatureACLs[0].fields['id']) {
            attributes.push('id');
        }
        if(req.user.Role.FeatureACLs[0].fields['amount']){
            attributes.push('amount');
        }
        if(req.user.Role.FeatureACLs[0].fields['date']){
            attributes.push('date');
        }
        if(req.user.Role.FeatureACLs[0].fields['currency']){
            attributes.push('currency');
        }
        if(req.user.Role.FeatureACLs[0].fields['retry_date']){
            attributes.push('retry_date');
        }
        if(req.user.Role.FeatureACLs[0].fields['status']){
            attributes.push('status');
        }
    }
}
db.Collection.findAll({attributes: attributes, offset: offset*1, limit: limit*1,where: {},
    include:[
        {
            model: db.Loan
        }
    ]})
    .then((Collections) => {
    res.send(Collections)
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    var attributes=[];
if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields) {
    if (req.user.Role.FeatureACLs[0].fields['ALL']) {
        attributes = ['id','amount', 'date', 'currency', 'retry_date', 'status']
    } else {
        if (req.user.Role.FeatureACLs[0].fields['id']) {
            attributes.push('id');
        }
        if (req.user.Role.FeatureACLs[0].fields['amount']) {
            attributes.push('amount');
        }
        if (req.user.Role.FeatureACLs[0].fields['date']) {
            attributes.push('date');
        }
        if (req.user.Role.FeatureACLs[0].fields['currency']) {
            attributes.push('currency');
        }
        if (req.user.Role.FeatureACLs[0].fields['retry_date']) {
            attributes.push('retry_date');
        }
        if (req.user.Role.FeatureACLs[0].fields['status']) {
            attributes.push('status');
        }
    }
}
    db.Collection.findOne({attributes: attributes, where: {
        id: req.params['id']
    },
        include:[
            {
                model: db.Loan
            }
        ]})
        .then((collection) => {
        res.send(collection)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {amount, date, currency, retry_date, status} = req.body;

db.Collection.findOne({where: {id: req.params['id']}})
    .then((collection) => {
    if(!collection) return next(new Errors.Validation("collection is not existed"));
if(req.user.Role.FeatureACLs[0].fields['amount'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    collection.amount = amount;
}
if(req.user.Role.FeatureACLs[0].fields['date'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    collection.date = date;
}
if(req.user.Role.FeatureACLs[0].fields['currency'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    collection.currency = currency;
}
if(req.user.Role.FeatureACLs[0].fields['retry_date'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    collection.retry_date = retry_date;
}
if(req.user.Role.FeatureACLs[0].fields['status'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    collection.status = status;
}

collection.save()
    .then(collection => res.send(collection));
})
.catch(err => next(err));
});


router.delete('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.Collection.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
