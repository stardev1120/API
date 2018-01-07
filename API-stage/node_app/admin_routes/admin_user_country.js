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
    const {adminuser_id, country_id} = req.body;

let query = {adminuser_id: adminuser_id, country_id: country_id};

db.AdminuserCountry.create(query)
    .then(adminuserCountry => {
    res.send(adminuserCountry);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, (req, res, next) => {
    db.AdminuserCountry.findAll({where: {},
    include: [{
        model: db.Country,
        foreignKey:'country_id',
        as: 'country'
    }]})
    .then((companies) => {
    res.send(companies)
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUserOrSameUser, (req, res, next) => {
    db.AdminuserCountry.findOne({where: {id: req.params['id']} ,
    include: [{
        model: db.Country,
        foreignKey:'country_id',
        as: 'country'
    }]})
    .then((adminuserCountry) => {
    res.send(adminuserCountry)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUserOrSameUser, (req, res, next) => {
    const {adminuser_id, country_id} = req.body;
db.AdminuserCountry.findOne({where: {id: req.params['id']}})
    .then((adminuserCountry) => {
    if(!adminuserCountry) return next(new Errors.Validation("admin user country not exist"));
adminuserCountry.adminuser_id = adminuser_id;
adminuserCountry.country_id = country_id;
adminuserCountry.save()
    .then(user => res.send(adminuserCountry));
})
.catch(err => next(err));
});


router.delete('/:id', middlewares.validateAdminUser, (req, res, next) => {
    db.AdminuserCountry.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
