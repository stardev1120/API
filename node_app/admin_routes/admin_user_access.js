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
    const{id, phone_number}=req.user;
    const otp =Math.floor(100000 + Math.random() * 900000)
let query={
    admin_user_id: id,
    user_id: user_id,
    otp: otp,
    using_period: (30),
    date: (new Date()).getDate()+1,
    status: "NOTVerified"
}

db.AdminUserAccess.create(query)
    .then(() => {

//db.User.findOne({id: user_id}).then((user) => {
  //  if(!user) return next(new Errors.Validation("User not exist"));
sendSMS(phone_number, req, otp).then(()=>{
db.User.findOne({id: user_id}).then((user)=>{
    res.send({"message": "done", user: user});
});
});

//})

})
.catch(err => next(err));
});

router.post('/checkUser', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, 
middlewares.checkAdminUserAccess2, (req, res, next) => {
    return next();
});


router.put('/', (req, res, next) => {
console.log(JSON.stringify(req.body));
    const otp = req.body.otp;
    const user_id = req.body.user_id*1;
        db.AdminUserAccess.findOne({where: {otp:otp, user_id: user_id}}).then((adminUserAccess)=>{
            adminUserAccess.status = 'Verified';
            adminUserAccess.date = addMinutes((new Date()), adminUserAccess.using_period)
            adminUserAccess.save().then((result)=>{
                        res.send({"message": "done"});
                });
    })
    .catch(err => res.send({err: err.message}))
    });


function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

module.exports = router;
