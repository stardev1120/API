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

router.get('/', middlewares.validateAdminUser, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);

    db.LoansHistory.findAll(filter_1)
    .then((histories) => {
    res.send(histories)
})
.catch(err => next(err));
});

router.get('/count', middlewares.validateAdminUser, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);

    db.LoansHistory.findAll({where:filter_1.where, include: filter_1.include})
    .then((histories) => {
    res.send({count:histories.length})
})
.catch(err => next(err));
});

module.exports = router;
