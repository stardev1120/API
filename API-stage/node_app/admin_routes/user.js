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
const Sequelize = require('sequelize')


const Op = Sequelize.Op;

router.post('/search', middlewares.validateAdminUser, (req, res, next) => {
    const {country_id}= req.headers;
    const{name, email, phone_number}=req.body
    db.User.findAll({where:{
            fname : { [Op.like]: '%' + name + '%'},
            mname : { [Op.like]: '%' + name + '%'},
            lname : { [Op.like]: '%' + name + '%'},
            email : { [Op.like]: '%' + email + '%'},
            phone_number : { [Op.like]: '%' + phone_number + '%'},
            country_id: country_id
    }})
    .then((users) => {
    res.send(users)
})
.catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, (req, res, next) => {
    const {country_id}= req.headers;
    db.User.findOne({where: {
        id: req.params['id'],
        country_id: country_id
    },
    include:[
        {
            model: db.Loan,
            as: 'loans',
            include:[
                {
                    model: db.Collection,
                    as: 'collections'
                }
            ]
        }
    ]})
    .then((user) => {
    res.send(user)
})
.catch(err => next(err));
});

module.exports = router;