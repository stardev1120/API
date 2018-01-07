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


router.post('/', middlewares.validateAdminUser , (req, res, next) => {
    const {role_id, feature_api_url} = req.body;

let query = {role_id: role_id, feature_api_url: feature_api_url};

db.FeatureACL.create(query)
    .then(featureACL => {
    res.send(featureACL);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, (req, res, next) => {
    db.FeatureACL.findAll({where: {},
    include: [{
        model: db.Role,
        foreignKey:'role_id',
        as: 'role'
    }]})
    .then((companies) => {
    res.send(companies)
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUserOrSameUser, (req, res, next) => {
    db.FeatureACL.findOne({where: {id: req.params['id']} ,
    include: [{
        model: db.Role,
        foreignKey:'role_id',
        as: 'role'
    }]})
    .then((featureACL) => {
    res.send(featureACL)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUserOrSameUser, (req, res, next) => {
    const {role_id, feature_api_url} = req.body;
db.FeatureACL.findOne({where: {id: req.params['id']}})
    .then((featureACL) => {
    if(!featureACL) return next(new Errors.Validation("Feature ACL not exist"));
featureACL.role_id = role_id;
featureACL.feature_api_url = feature_api_url;
featureACL.save()
    .then(user => res.send(featureACL));
})
.catch(err => next(err));
});


router.delete('/:id', middlewares.validateAdminUser, (req, res, next) => {
    db.FeatureACL.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
