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
const _ = require('lodash');


router.post('/' , (req, res, next) => {
    const {role_id, role_name, max_session_time} = req.body;

let query = {role_id: role_id, role_name: role_name, max_session_time: max_session_time};

db.Role.create(query)
    .then(role => {
db.FeatureACL.findAll({where:{role_id: 1}}).then((features)=>{
var copiedFeatures = [];
_.each(features, (feature)=>{
var actions = _.mapValues(feature.actions, ()=>{
return false;
});
var fields = _.mapValues(feature.fields, ()=>{
return false;
});
var other = _.mapValues(feature.other, ()=>{
return false;
});
copiedFeatures.push({
role_id: role.id,
module: feature.module,
feature_api_url: feature.feature_api_url,
actions: actions,
fields: fields,
other: other
});
});
if(copiedFeatures.length<=0)
{
	res.send(role);
	return 
}

db.FeatureACL.bulkCreate(copiedFeatures).then(()=>{
	res.send(role);
	return 
})
})
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);

    db.Role.findAll(filter_1)
    .then((roles) => {
    res.send(roles)
})
.catch(err => next(err));
});

router.get('/count', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);

    db.Role.findAll({where:filter_1.where})
    .then((roles) => {
    res.send({count:roles.length})
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.Role.findOne({where: {id: req.params['id']},
include:[{
model: db.FeatureACL
}]
})
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
