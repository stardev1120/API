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
    db.Collection.findAll({offset: offset*1, limit: limit*1,where: {},
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
    db.Collection.findOne({where: {
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
collection.amount = amount;
collection.date = date;
collection.currency = currency;
collection.retry_date = retry_date;
collection.status = status;

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
