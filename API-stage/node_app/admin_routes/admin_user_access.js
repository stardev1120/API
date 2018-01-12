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
const sendSMS = require('../helper/sendSms');
var md5 = require('md5');

router.post('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const{user_id}=req.body
    const{id}=req.user;
    const otp =Math.floor(100000 + Math.random() * 900000)
let query={
    admin_user_id: id,
    user_id: user_id,
    otp: otp,
    using_period: (60*60*30),
    date: (new Date()).getDate()+1,
    status: "NOTVerified"
}

db.AdminUserAccess.create(query)
    .then(() => {
db.User.findOne({id: user_id}).then((user) => {
    if(!user) return next(new Errors.Validation("User not exist"));
sendSMS(user.phone_number, req, otp).then(()=>{
    res.send({"message": "done"+ otp});
});

})

})
.catch(err => next(err));
});

router.put('/', (req, res, next) => {
    const code = req.body.code;
    const user_id = req.body.user_id;


        db.AdminUserAccess.findOne({otp:otp, user_id: user_id}).then((adminUserAccess)=>{
            adminUserAccess.status = 'Verified';
        adminUserAccess.save().then((result)=>{
                        res.send({"message": "done"});
                });
    })
    .catch(err => res.send({err: err.message}))
    });

module.exports = router;