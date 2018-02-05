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


router.post('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth,  (req, res, next) => {
    const {amount, date, currency, retry_date, status, date_of_entry, bank_response, collection_id} = req.body;

let query = {amount: amount, date: date, currency: currency, retry_date: retry_date, status: status,
    date_of_entry:date_of_entry, bank_response:bank_response, collection_id: collection_id };

db.CollectionHistory.create(query)
    .then(collectionHistory => {
    res.send(collectionHistory);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    //const {country_id} = req.headers;
   const {filter}=req.query;
   const filter_1 = JSON.parse(filter);
    db.CollectionHistory.findAll({offset: filter_1.offset, limit: filter_1.limit, where: filter_1.where,
    include: [{
        model: db.Collection,
       // where: {id: filter_1.where.country_id}
    }]})
    .then((collectionsHistory) => {
    res.send(collectionsHistory)
})
.catch(err => next(err));
});


router.get('/count', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    //const {country_id} = req.headers;
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);
     db.CollectionHistory.findAll({where: filter_1.where,
     include: [{
         model: db.Collection,
         //where: {id: filter_1.where.country_id}
     }]})
     .then((collectionsHistory) => {
        res.send({count:collectionsHistory?collectionsHistory.length:0})
 })
 .catch(err => next(err));
 });

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    //const {country_id} = req.headers;
    db.CollectionHistory.findOne({where: {id: req.params['id']*1} ,
    include: [{
        model: db.Collection,
      //  where: {id: country_id}
    }]})
    .then((collectionHistory) => {
    res.send(collectionHistory)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {amount, date, currency, retry_date, status, date_of_entry, bank_response, collection_id}  = req.body;
db.CollectionHistory.findOne({where: {id: req.params['id']}})
    .then((collectionHistory) => {
    if(!collectionHistory) return next(new Errors.Validation("User not exist"));
collectionHistory.amount = amount;
collectionHistory.date = date;
collectionHistory.currency = currency;
collectionHistory.retry_date = retry_date;
collectionHistory.status = status;
collectionHistory.date_of_entry = date_of_entry;
collectionHistory.bank_response = bank_response;
collectionHistory.collection_id = collection_id;
collectionHistory.save()
    .then(collectionHistory => {
        res.json(collectionHistory).status(200);
        next()
    });
})
.catch(err => next(err));
});


router.delete('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.CollectionHistory.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
