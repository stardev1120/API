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
const recaptcha = require('../helper/recaptcha')
var md5 = require('md5');
const config = require('../config/config');
const speakeasy = require('speakeasy')

router.post('/login', recaptcha, (req, res, next) => {
    const password = md5(req.body.password);
    db.AdminUser.findOne({
        where: {'email': req.body.email, 'password':  password},
        include: [{
            model: db.Role,
            include:[{
                model: db.FeatureACL,
                where: {feature_api_url: req.baseUrl}
            }]
        }]
    }).then((adminUser) => {
        if (!adminUser) return next(new Errors.UnAuth("not exist adminUser"));
if(adminUser.Role.FeatureACLs[0] && adminUser.Role.FeatureACLs[0].other['2FA'] && !adminUser.two_factor_temp_secret && !adminUser.otpauth_url) {
var secret = speakeasy.generateSecret();
    adminUser.two_factor_temp_secret = secret.base32;
    adminUser.otpauth_url = 'otpauth://totp/AppName:UmbrellaAdmin?secret='+secret.base32+'&issuer=AppName' //secret.otpauth_url;
}
        adminUser.update({number_password_attempt: adminUser.number_password_attempt+1, last_login: (new Date()),
        two_factor_temp_secret: (adminUser.Role.FeatureACLs[0] && adminUser.Role.FeatureACLs[0].other['2FA'] ) ? adminUser.two_factor_temp_secret: '',
            otpauth_url: (adminUser.Role.FeatureACLs[0] && adminUser.Role.FeatureACLs[0].other['2FA'] ) ? adminUser.otpauth_url: ''}).then();
        res.send({
            token: auth.createJwtWithexpiresIn({id: adminUser.id, valid:1}, adminUser.max_session_time)
        });
    })
        .catch(err => res.send({err: err.message}))
});
router.post('/2-fa-verification', middlewares.validateAdminUser, function(req, res) {
    const {faCode} = req.body;
    var user = req.user;
    var verified = speakeasy.totp.verify({
        secret: user.two_factor_temp_secret,
        encoding: 'base32',
        token: faCode
    });
    //check if the token has changed
    console.log(verified);
    res.send({"verified": verified});

});
router.post('/forget-password', (req, res, next) => {
    db.AdminUser.findOne({where: {email: req.body.email}})
        .then((adminUser) => {
            if (!adminUser) return next(new Errors.Validation("User not exist"));
            const token=auth.createJwt({id: adminUser.id});
            const baselink = config.baseUrl + '/#/reset-password?token=';
            const link = `${baselink}${token}`;
            sendMail(req.body.email, 'Reset your password', link);

            res.send({"message": link});
        })
        .catch(err => res.send({ err: err.message }));


});

router.put('/reset/:token', (req, res, next) => {

    const token = req.params['token'];
    const new_password = req.body.newPassword;
    const data = auth.verifyJwt(token)

    db.AdminUser.findOne({
        where: {id: data.id}
    }).then((adminUser) => {
        if (!adminUser) return next(new Errors.UnAuth(dictionary.userNoAccesToken));

        adminUser.update({
            password: md5(new_password)
        }).then((result)=>{
            res.send({"message": "done"});
        });
    })
        .catch(err => res.send({err: err.message}))
});

router.put('/change-password', middlewares.validateAdminUser, (req, res, next) => {

    if(req.user.password === md5(req.body.password))
    {
        req.user.update({
            password: md5(req.body.new_password)
        }).then(()=>{
            res.send({"message": "done"});
        });
    } else {
        return next(new Errors.Validation(dictionary.oldPasswordNotValid));
    }
});


router.post('/logout', middlewares.validateAdminUser, function (req, res) {
    res.send({token: auth.createJwtWithexpiresIn({id:req.user.id, valid:0}, 1)});
    //res.send("logout success!");
});

router.post('/renew-session', middlewares.validateAdminUser, function (req, res) {
    res.send({token: auth.createJwtWithexpiresIn({id:req.user.id, valid:1}, req.user.max_session_time)});
});


router.get('/md5/:password', function (req, res) {
    res.send(md5(req.params['password']));
});

router.post('/' , middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {name, email, password, phone_number, company_id, role_id, max_session_time, AdminuserCountries} = req.body;

    if(req.user.Role.role_id != 'super_admin' && role_id == 'super_admin') {
        res.send(new Errors.UnAuth("You do not have the permission to create super admin"))
    }
    else {
        let query = {
            name: name,
            email: email,
            password: md5(password),
            company_id: company_id,
            phone_number: phone_number,
            role_id: role_id,
            max_session_time: max_session_time
        };

        db.AdminUser.create(query)
            .then(adminUser => {
                if(AdminuserCountries && AdminuserCountries.length > 0)
                {
                    var actions = AdminuserCountries.map((country) => {
                        return db.AdminuserCountry.create({admin_user_id: adminUser.id, country_id: country})
                    })
                    var results = Promise.all(actions);
                    return results.then(data =>
                    {
                        res.send({"message": "done"});
                    }) ;
                }
                else {
                    res.send({"message": "done"});
                }
            })
            .catch(err => res.send({err: err.message}))
    }

});

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);

    db.AdminUser.findAll({
        offset: filter_1.offset,
        limit: filter_1.limit,
        where: filter_1.where,
        include: [{
            model: db.Role
        },
            {
                model: db.AdminuserCountry
            },
            {
                model: db.Company
            }]
    })
        .then((adminUsers) => {
            res.send(adminUsers)
        })
        .catch(err => next(err));
});
router.get('/count', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);
    db.AdminUser.findAll({where:filter_1.where})
        .then((adminUsers) => {
            res.send({count: adminUsers.length})
        })
        .catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUserOrSameUser, (req, res, next) => {
    db.AdminUser.findOne({
    where: {id: req.params['id'] !== 'me' ? req.params['id'] : req.user.id},
    include: [{
        model: db.Role,
        include: [{
            model: db.FeatureACL,
            as: 'FeatureACLs',
            required: false
        }]
    },
        {
            model: db.AdminuserCountry,
include:[{
model: db.Country
}]
        },
        {
            model: db.Company
        }]
})
    .then((adminUser) => {
    res.send(adminUser)
}).catch(err => next(err));
})


router.put('/:id', middlewares.validateAdminUserOrSameUser, (req, res, next) => {
    const {name, phone_number, email, company_id, role_id, max_session_time, number_password_attempt, AdminuserCountries} = req.body;
    db.AdminUser.findOne({where: {id: req.params['id']}})
        .then((adminUser) => {
            if(!adminUser)return next(new Errors.Validation("User not exist"));
            adminUser.name = name;
            adminUser.phone_number = phone_number;
            adminUser.email = email;
            adminUser.company_id = company_id;
            adminUser.role_id = role_id;
            adminUser.max_session_time = max_session_time;
            adminUser.number_password_attempt = number_password_attempt;
            adminUser.save()
                .then((adminUser) => {
                    db.AdminuserCountry.destroy({
                        where: {adminuser_id: adminUser.id},
                        truncate: true
                    }).then(()=>{
                        if(AdminuserCountries && AdminuserCountries.length > 0){
                            var actions= AdminuserCountries.map((country) => {
                                return db.AdminuserCountry.create({admin_user_id: adminUser.id, country_id: country})
                            })
                            var results = Promise.all(actions);
                            return results.then(data => {
                                res.send(adminUser)
                            }).catch(err => next(err));
                        } else {
                            res.send(adminUser)
                        }
                    }).catch(err => next(err));

                });
        })
        .catch(err => next(err));
});


router.delete('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.AdminUser.destroy({where: {id: req.params['id']}})
        .then(() => res.send(true)).catch(err => next(err))
        .catch(err => next(err));
});


module.exports = router;
