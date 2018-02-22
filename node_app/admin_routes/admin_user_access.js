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
var query={
    admin_user_id: id,
    user_id: user_id,
    otp: otp,
    using_period: (30),
    date: (new Date()).getDate()+1,
    status: "NOTVerified"
}
db.User.findOne({where:{id: user_id}}).then((user)=>{
if(!user) return next(new Errors.Validation("User not exist"));
db.AdminUserAccess.create(query)
    .then(() => {
//db.User.findOne({id: user_id}).then((user) => {
    
sendSMS(user.phone_number, req, otp).then(()=>{

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


router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
	const {country_id} = req.headers;
    const {filter}=req.query;
const filter_1 = JSON.parse(filter);
var filterCountry = {};
if(country_id){
    filterCountry.id = country_id
}
db.AdminUserAccess.findAll(filter_1)
    .then((adminUserAccesses) => {
    res.send(adminUserAccesses)
})
.catch(err => next(err));
});

router.get('/count', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
	const {country_id} = req.headers;
    const {filter}=req.query;
const filter_1 = JSON.parse(filter);
var filterCountry = {};
if(country_id){
    filterCountry.id = country_id
}

db.AdminUserAccess.findAll({where: filter_1.where,
    include:filter_1.include
})
    .then((adminUserAccesses) => {
    res.send({count:adminUserAccesses.length})
})
.catch(err => next(err));
});

router.put('/', function(req, res, next) {
console.log(JSON.stringify(req.body));
    const otp = req.body.otp;
    const user_id = req.body.user_id*1;
        db.AdminUserAccess.findAll({
            limit: 1,
            where: {user_id: user_id},
            order: [ [ 'created_at', 'DESC' ]]
        }).then((adminUserAccess)=>{
            if(!adminUserAccess) return next(new Errors.Validation("Invalid OTP"));
            if(adminUserAccess && adminUserAccess[0] && adminUserAccess[0].otp !== otp) {return next(new Errors.Validation("Invalid OTP.."));}
            adminUserAccess[0].status = 'Verified';
            adminUserAccess[0].date = addMinutes((new Date()), adminUserAccess[0].using_period)
            adminUserAccess[0].save().then((result)=>{
                        res.send({"message": "done"});
                });
    })
    .catch(err => res.send({err: err.message}))
});

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

module.exports = router;
