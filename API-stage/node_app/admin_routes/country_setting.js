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
    const {name, value, country_id} = req.body;

let query = {name: name, value: value, country_id: country_id};

db.CountrySetting.create(query)
    .then(countrySetting => {
    res.send(countrySetting);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id} = req.headers;
const {offset, limit}=req.query;
db.CountrySetting.findAll({offset: offset, limit: limit, where: {},
include:[
    {
        model: db.Country,
        where: {country_id: country_id}
    }
]})
    .then((countrySettings) => {
    res.send(countrySettings)
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id} = req.headers;
    db.CountrySetting.findOne({where: {
    id: req.params['id']
},
    include:[
        {
            model: db.Country,
            where: {country_id: country_id}
        }
    ]})
    .then((countrySetting) => {
    res.send(countrySetting)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {name, value, country_id} = req.body;
db.CountrySetting.findOne({where: {id: req.params['id']}})
    .then((countrySetting) => {
    if(!countrySetting) return next(new Errors.Validation("countrySetting is not existed"));
countrySetting.name = name;
countrySetting.value = value;
countrySetting.country_id = country_id;
countrySetting.save()
    .then(countrySetting => res.send(countrySetting));
})
.catch(err => next(err));
});


router.delete('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.CountrySetting.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
