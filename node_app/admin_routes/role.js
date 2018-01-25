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


router.post('/' , (req, res, next) => {
    const {role_id, role_name, max_session_time} = req.body;

let query = {role_id: role_id, role_name: role_name, max_session_time: max_session_time};

db.Role.create(query)
    .then(role => {
    res.send(role);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {offset, limit}=req.query;
    db.Role.findAll({offset: offset, limit: limit, where: {}})
    .then((companies) => {
    res.send(companies)
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.Role.findOne({where: {id: req.params['id']}})
    .then((role) => {
    res.send(role)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {role_id, role_name, max_session_time} = req.body;
db.Role.findOne({where: {id: req.params['id']}})
    .then((role) => {
    if(!role) return next(new Errors.Validation("Role not exist"));
role.role_id = role_id;
role.role_name = role_name;
role.max_session_time = max_session_time;
role.save()
    .then(role => res.send(role));
})
.catch(err => next(err));
});


router.delete('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.Role.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
