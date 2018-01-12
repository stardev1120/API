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

router.post('/search', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id}= req.headers;
    const{query:{name, email, phone_number}, cursor:{offset, limit}}=req.body
    db.User.findAll({offset: offset*1, limit: limit*1, where:{
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

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth,
    middlewares.checkAdminUserAccess, (req, res, next) => {
    const {country_id}= req.headers;

    var include = [];
    if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields&&
        (req.user.Role.FeatureACLs[0].fields['LOAN'] || req.user.Role.FeatureACLs[0].fields['ALL'])){
        include.push({
            model: db.Loan,
            include:[
                {
                    model: db.Collection
                }
            ]
        })
    }
    db.User.findOne({where: {
        id: req.params['id'],
        country_id: country_id
    },
    include:include
    })
    .then((user) => {
    res.send(user)
})
.catch(err => next(err));
});

module.exports = router;