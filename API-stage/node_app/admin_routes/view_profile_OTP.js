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
const sendMail = require('../helper/sendMail');
var md5 = require('md5');

router.post('/', middlewares.validateAdminUser, (req, res, next) => {
    const{user_id}=req.body
    const{id}=req.user;
    const token =auth.createJwt({user_id:user_id, admin_user_id: id});
let query={
    admin_user_id: id,
    user_id: user_id,
    token: token,
    using_period: (60*60*15),
    availability: (new Date()).getDate()+1,
    status: "pending"
}

db.ViewProfileOTP.create(query)
    .then(() => {
    const baselink='http://localhost:3000/view-profile-otp/';// todo we need to change it to be configurable.
const link = `${baselink}${token}`;
db.User.findOne({id: user_id}).then((user) => {
    if(!user) return next(new Errors.Validation("User not exist"));
    sendMail(user.email, 'user admin requests view your profile', link);
    res.send({"message": "done"+ link});
})

})
.catch(err => next(err));
});

router.put('/:token', (req, res, next) => {
    const token = req.params['token'];
    const isApproved = req.body.approval;
    const data = auth.verifyJwt(token)

    db.AdminUser.findOne({
        where: {id: data.admin_user_id}
    }).then((adminUser) => {
        if (!adminUser) return next(new Errors.Validation(dictionary.userNoAccesToken));

        db.ViewProfileOTP.findOne({token:token}).then((viewProfileOtp)=>{
                viewProfileOtp.status = isApproved?'approved':'rejected';
                viewProfileOtp.save().then((result)=>{

                    if(isApproved){
                        const baselink='http://localhost:3000/view-profile/';// todo we need to change it to be configurable.
                        const link = `${baselink}${viewProfileOtp.user_id}/${token}`;
                        db.AdminUser.findOne({id: viewProfileOtp.admin_user_id})
                            .then((adminUser)=>{
                            sendMail(adminUser.email, 'your request is approved by user', link);
                            res.send({"message": "done"});
                        })

                    } else {
                        res.send({"message": "done"});
                    }
                });
    })
    })
    .catch(err => res.send({err: err.message}))
    });

module.exports = router;