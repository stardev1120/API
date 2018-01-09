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
var md5 = require('md5');

router.post('/login', (req, res, next) => {
    const password = md5(req.body.password);
    db.AdminUser.findOne({
        where: {'email': req.body.email, 'password':  password}
    }).then((adminUser) => {

        if (!adminUser) return next(new Errors.Validation("not exist adminUser"));

        adminUser.update({number_password_attempt: adminUser.number_password_attempt+1}).then();

        res.send({token: auth.createJwtWithexpiresIn({id: adminUser.id, valid:1}, adminUser.max_session_time)});
    })
    .catch(err => res.send({err: err.message}))
});

router.post('/forget-password', (req, res, next) => {
    db.AdminUser.findOne({where: {email: req.body.email}})
    .then((adminUser) => {
    if (!adminUser) return next(new Errors.Validation("User not exist"));
const token=auth.createJwt({id: adminUser.id});
const baselink='http://localhost:3000/reset/';// todo we need to change it to be configurable.
const link = `${baselink}${token}`;

sendMail(req.body.email, 'Reset your password', link);

res.send({"message": link});
})
.catch(err => res.send({ err: err.message }));


});

router.put('/reset/:token', (req, res, next) => {

    const token = req.params['token'];
    const new_password = req.body.password;
    const data = auth.verifyJwt(token)

    db.AdminUser.findOne({
        where: {id: data.id}
    }).then((adminUser) => {
        if (!adminUser) return next(new Errors.Validation(dictionary.userNoAccesToken));

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

router.post('/', middlewares.validateAdminUser , (req, res, next) => {
    const {name, email, password, company_id, role_id, max_session_time, FAfield, countries} = req.body;

    let query = {
        name: name,
        email: email,
        password: md5(password),
        company_id: company_id,
        role_id: role_id,
        max_session_time: max_session_time,
        FAfield:FAfield
    };

    db.AdminUser.create(query)
        .then(adminUser => {

 var actions= countries.map((country) => {
     return db.AdminuserCountry.create({admin_user_id: adminUser.id, country_id: country})
    })
var results = Promise.all(actions);
results.then(data =>
{
    res.send(adminUser.id);
});

        })
        .catch(err => res.send({err: err.message}))
 })

 router.get('/', middlewares.validateAdminUser, (req, res, next) => {
 db.AdminUser.findAll({where: {},
     include: [{
         model: db.Role
     }]})
 .then((adminUsers) => {
 res.send(adminUsers)
 })
 .catch(err => next(err));
 });

router.get('/:id', middlewares.validateAdminUserOrSameUser, (req, res, next) => {
    db.AdminUser.findOne({where: {id: req.params['id']} ,
    include: [{
    model: db.Role
}]})
    .then((adminUser) => {
    res.send(adminUser)
})
.catch(err => next(err));
});

 router.put('/:id', middlewares.validateAdminUserOrSameUser, (req, res, next) => {
     const {name, email, company_id, role_id, max_session_time, FAfield, number_password_attempt, countries} = req.body;
    db.AdminUser.findOne({where: {id: req.params['id']}})
    .then((adminUser) => {
        if(!adminUser) return next(new Errors.Validation("User not exist"));
        adminUser.name = name;
        adminUser.email = email;
        adminUser.company_id = company_id;
        adminUser.role_id = role_id;
        adminUser.max_session_time = max_session_time;
        adminUser.FAfield = FAfield;
        adminUser.number_password_attempt = number_password_attempt;
        adminUser.save()
            .then(() => {
            db.AdminuserCountry.destroy({
            where: {adminuser_id: admin_user.id},
            truncate: true
        }).then(()=>{
            if(countries && countries.length > 0){
    var actions= countries.map((country) => {
            return db.AdminuserCountry.create({admin_user_id: adminUser.id, country_id: country})
        })
    var results = Promise.all(actions);
    results.then(data =>
    {
        res.send(adminUser)
});
} else {
    res.send(adminUser)
}
        })

            });
    })
    .catch(err => next(err));
 });


router.delete('/:id', middlewares.validateAdminUser, (req, res, next) => {
     db.AdminUser.destroy({where: {id: req.params['id']}})
        .then(() => res.send(true))
        .catch(err => next(err));
});


module.exports = router;
