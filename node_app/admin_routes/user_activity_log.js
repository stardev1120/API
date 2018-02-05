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

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);

    db.UserActivityLog.findAll(filter_1)
    .then((logs) => {
    res.send(logs)
})
.catch(err => next(err));
});

router.get('/count', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);

    db.UserActivityLog.findAll({where:filter_1.where})
    .then((logs) => {
    res.send({count:logs.length})
})
.catch(err => next(err));
});

module.exports = router;
