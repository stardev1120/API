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
        if (!adminUser) return next(new Errors.UnAuth("invalid email or password"));
        if (adminUser.status !== 'Active') return next(new Errors.UnAuth("you will not be able to login. Please, Contact Umbrella Admin"));      
if(adminUser.Role.FeatureACLs[0] && adminUser.Role.FeatureACLs[0].other['2FA'] && (!adminUser.two_factor_temp_secret && !adminUser.otpauth_url || !adminUser.is2FAVerified)) {
var secret = speakeasy.generateSecret();
    adminUser.two_factor_temp_secret = secret.base32;
    adminUser.otpauth_url = `otpauth://totp/Umbrella%20Admin:${adminUser.email}?secret=`+secret.base32+`&issuer=Umbrella%20Admin` //secret.otpauth_url;
}
        adminUser.update({number_password_attempt: adminUser.number_password_attempt+1, last_login: (new Date()),
        two_factor_temp_secret: (adminUser.Role.FeatureACLs[0] && adminUser.Role.FeatureACLs[0].other['2FA'] ) ? adminUser.two_factor_temp_secret: '',
            otpauth_url: (adminUser.Role.FeatureACLs[0] && adminUser.Role.FeatureACLs[0].other['2FA'] ) ? adminUser.otpauth_url: ''}).then();
        res.send({
            token: auth.createJwtWithexpiresIn({id: adminUser.id, valid:1}, adminUser.max_session_time)
        });
    })
        .catch(err => next(new Errors.InternalError(err.message)))
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
//    console.log(verified, faCode, user.two_factor_temp_secret);
    if (verified) {
        return db.AdminUser.findOne({
            where: {'id': user.id}
        }).then(function (adminUser) {
            adminUser.update({
                is2FAVerified: true
            }).then();
            res.send({"verified": verified});
        })
    } else {
        res.send({"verified": verified});
    }

});
router.put('/reset-2-fa', middlewares.validateAdminUser, function(req, res) {
    var user = req.user;
    db.AdminUser.findOne({
        where: {'id': user.id},
        include: [{
            model: db.Role,
            include:[{
                model: db.FeatureACL,
                where: {feature_api_url: req.baseUrl}
            }]
        }]
    }).then((adminUser) => {
        if (!adminUser) return next(new Errors.UnAuth("invalid email or password"));
    if(adminUser.Role.FeatureACLs[0] && adminUser.Role.FeatureACLs[0].other['2FA']) {
        var secret = speakeasy.generateSecret();
        adminUser.two_factor_temp_secret = secret.base32;
        adminUser.otpauth_url = `otpauth://totp/Umbrella%20Admin:${adminUser.email}?secret=`+secret.base32+`&issuer=Umbrella%20Admin` //secret.otpauth_url;
    }
    adminUser.update({ two_factor_temp_secret: (adminUser.Role.FeatureACLs[0] && adminUser.Role.FeatureACLs[0].other['2FA'] ) ? adminUser.two_factor_temp_secret: '',
        otpauth_url: (adminUser.Role.FeatureACLs[0] && adminUser.Role.FeatureACLs[0].other['2FA'] ) ? adminUser.otpauth_url: '', is2FAVerified: false}).then();
    res.send({"message": "done"});
})
.catch(err => next(new Errors.InternalError(err.message)))

});
router.post('/forget-password', (req, res, next) => {
    db.AdminUser.findOne({where: {email: req.body.email}})
        .then((adminUser) => {
            if (!adminUser) return next(new Errors.Validation("Counld not find a user with this email address."));
            const token=auth.createJwt({id: adminUser.id});
            const baselink = config.baseUrl + '/#/reset-password?token=';
            const link = `${baselink}${token}`;
            sendMail(req.body.email, 'Reset your password', link);

            res.send({"message": "done"});
        })
.catch(err => next(new Errors.InternalError(err.message)));


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
.catch(err => next(new Errors.InternalError(err.message)));
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

router.put('/admin/change-password', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
db.AdminUser.findOne({where: {id: req.body.id}})
    .then((adminUser) => {
    if(!adminUser) return next(new Errors.Validation("Admin user is not existed"));
adminUser.password = md5(req.body.password);
adminUser.save()
    .then(adminUser => res.send(adminUser));
})
.catch(err => next(err));
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
    const {name, email, password, phone_number, company_id, role_id, max_session_time, status, AdminuserCountries} = req.body;

    if(req.user.Role.role_id !== 1 && role_id === 1) {
        return next(new Errors.Forbidden("You do not have the permission to create super admin"))
    }
    else {
        let query = {
            name: name,
            email: email,
            password: md5(password),
            company_id: company_id,
            phone_number: phone_number,
            role_id: role_id,
            max_session_time: max_session_time,
            status: status
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
    .catch(err => next(new Errors.InternalError(err.message)))
    }

});

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);

    db.AdminUser.findAll(filter_1)
        .then((adminUsers) => {
            res.send(adminUsers)
        })
.catch(err => next(new Errors.InternalError(err.message)))
});
router.get('/count', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);
    db.AdminUser.findAll({where:filter_1.where})
        .then((adminUsers) => {
            res.send({count: adminUsers.length})
        })
.catch(err => next(new Errors.InternalError(err.message)))
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
    }).catch(err => next(new Errors.InternalError(err.message)));
})


router.put('/:id', middlewares.validateAdminUserOrSameUser, (req, res, next) => {
    const {name, phone_number, email, company_id, role_id, max_session_time, number_password_attempt, AdminuserCountries, photo, status} = req.body;

if(req.user.role_id !== 1 && role_id === 1) {
    return next(new Errors.Forbidden("You do not have the permission to update super admin"))
}
else {
    db.AdminUser.findOne({where: {id: req.params['id']}})
        .then((adminUser) => {
        if(!adminUser)return next(new Errors.Validation("Counld not find a user with this email address."));
    if(req.user.Role.role_id !== 1 && adminUser.role_id === 1) {
        return next(new Errors.Forbidden("You do not have the permission to create super admin"))
    }
    adminUser.name = name;
    adminUser.phone_number = phone_number;
    adminUser.email = email;
    adminUser.company_id = company_id;
    adminUser.role_id = role_id;
    adminUser.max_session_time = max_session_time;
    adminUser.number_password_attempt = number_password_attempt;
    adminUser.photo = photo;
    adminUser.status = status;
    adminUser.save()
        .then((adminUser) => {
        if(AdminuserCountries && AdminuserCountries.length > 0){
return db.AdminuserCountry.destroy({
        where: {admin_user_id: adminUser.id}
    }).then(()=>{
var actions= AdminuserCountries.map((country) => {
            return db.AdminuserCountry.create({admin_user_id: adminUser.id, country_id: country})
        })
        var results = Promise.all(actions);
        return results.then(data => {
            res.send(adminUser)
    })
})      
    } else {
        res.send(adminUser)
    }
}).catch(err => next(err));
})


.catch(err => next(new Errors.InternalError(err.message)))
}
});


router.delete('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.AdminUser.destroy({where: {id: req.params['id']}})
        .then(() => res.send(true))
.catch(err => next(new Errors.InternalError(err.message)))
})





module.exports = router;
