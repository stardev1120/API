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
    const {transactionType, amount, admin_user_id, loan_id} = req.body;

let query = {transactionType: transactionType, amount: amount, admin_user_id: admin_user_id, loan_id: loan_id};

db.AdminCollectDistribute.create(query)
    .then(adminCollectDistribute => {
    res.send(adminCollectDistribute);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
const filter_1 = JSON.parse(filter);

db.AdminCollectDistribute.findAll(filter_1)
    .then((adminCollectDistributes) => {
    res.send(adminCollectDistributes)
})
.catch(err => next(err));
});

router.get('/count', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
const filter_1 = JSON.parse(filter);

db.AdminCollectDistribute.findAll({where:filter_1.where, include: filter_1.include})
    .then((adminCollectDistributes) => {
    res.send({count:adminCollectDistributes.length})
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.AdminCollectDistribute.findOne({where: {
    id: req.params['id']
}})
    .then((adminCollectDistribute) => {
    res.send(adminCollectDistribute)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {transactionType, amount, admin_user_id, loan_id} = req.body;
db.AdminCollectDistribute.findOne({where: {id: req.params['id']}})
    .then((adminCollectDistribute) => {
    if(!adminCollectDistribute) return next(new Errors.Validation("adminCollectDistribute is not existed"));
adminCollectDistribute.transactionType = transactionType;
adminCollectDistribute.amount = amount;
adminCollectDistribute.admin_user_id = admin_user_id;
adminCollectDistribute.loan_id = loan_id;
adminCollectDistribute.save()
    .then(adminCollectDistribute => res.send(adminCollectDistribute));
})
.catch(err => next(err));
});


router.delete('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.AdminCollectDistribute.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
