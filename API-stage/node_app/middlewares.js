'use strict'
const geoip = require('geoip-lite');
const NodeGeocoder = require('node-geocoder');
var rp = require('request-promise');

const Errors = require('./errors');
const db = require('./models');
const helper = require('./helper');


var fs = require('fs');
var config;
if (fs.existsSync('./config/config_prod.json')) {
    // Do something
    console.log('prod config picked');
    config = require('./config/config_prod');
}
else if (fs.existsSync('./config/config_stage.json')) {
    // Do something
    console.log('stage config picked');
    config = require('./config/config_stage');
}
else
{
  console.log('Dev/Local config picked');
  config = require('./config/config');
}
const auth = require('./helper/auth');
const dictionary = require('./dictionary.json')
const fbConnect = 'https://graph.facebook.com/me?fields=email&access_token=';

module.exports = {
    secure :function(req, res, next) {
     // console.log('req.session', req.session.userId)
      //get token https://developers.facebook.com/tools/explorer/?method=GET&path=me%3Ffields%3Did%2Cname&version=v2.9
          var token = req.body.fbToken;
          rp(fbConnect+token)
            .then(response => {
              console.log('response', response)
               response = JSON.parse(response);
               if(response.id) {
                   req.fbId = response.id;
                   next();
               } else {
                   res.send("0");
               }
            })
            .catch(err => res.send({ err: err.message }));
  },
  validateUser: function(req, res, next) {
    if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')) return next(new Errors.Validation("No user token"));
    const data = auth.verifyJwt(req.headers.authorization.split(' ')[1])
    db.User.findOne({ where: { verified: 1, status: "Active", id: data.id } })
      .then(user => {
          if (user) {
            helper.getCountrySettingsByCountryId(user.country_id)
            .then(countrySettings=>{
              const countUserAge = new Date().getFullYear() - new Date(user.dob).getFullYear();
              if (countUserAge >= countrySettings.min_age) {
                next();
              } else {
               // delete req.session.userId;
                return next(new Errors.Validation("User age not valid"));
              }
            })
          } else {
            return next(new Errors.Validation("User not verified"));
          }

      })
      .catch(err => res.send({ err: err.message }))
  },
  validateUserSession: function(req, res, next) {
    if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')) return next(new Errors.Validation("No user token"));
    const data = auth.verifyJwt(req.headers.authorization.split(' ')[1])
console.log('user!!!', data)
    db.User.findOne({where: {id: data.id}})
    .then((user) => {
      if (!user) return next(new Errors.Validation("User not exist"));
      req.user = user;
      //console.log('user!!!', user)

      helper.getCountrySettingsByCountryId(user.country_id)
      .then(countrySettings=>{
        req.countrySettings = countrySettings;
        next()
      })
    })
    .catch(err => res.send({ err: err.message }));
  },
    validateUserSession2: function(req, res, next) {
    if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')) return next(new Errors.Validation("No user token"));
    const data = auth.verifyJwt(req.headers.authorization.split(' ')[1])
console.log('user!!!', data)
    db.User.findOne({where: {id: data.id}})
    .then((user) => {
      if (!user) return next(new Errors.Validation("{\"token\": \"invalid\"}"));
      req.user = user;
      //console.log('user!!!', user)

      helper.getCountrySettingsByCountryId(user.country_id)
      .then(countrySettings=>{
        req.countrySettings = countrySettings;
        next()
      })
    })
    .catch(err => res.send({ err: err.message }));
  },
  errorHandler: function(err, req, res, next) {
    res.status(err.status || 500).send(err.message);
  },
 validateAdminUser: function(req, res, next) {
        if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')) return next(new Errors.Validation("No user token"));
        const data = auth.verifyJwt(req.headers.authorization.split(' ')[1])
        console.log('user!!!', data)
        if(data.valid !== 1) return next(new Errors.Validation("No user token"));

        db.AdminUser.findOne({where: {id: data.id},
            include: [{
                model: db.Role,
                include:[{
                    model: db.FeatureACL,
                    where: {feature_api_url: req.baseUrl}
                }]
            }]})
            .then((adminUser) => {
            if (!adminUser) return next(new Errors.Validation("User not exist"));

        const{url, body, params, method, originalUrl,baseUrl}=req;
        const action_req = {
            url: url,
            body: body,
            params: params,
            method: method,
            originalUrl:originalUrl,
            baseUrl:baseUrl
        }
        db.UserActivityLog.create({
                admin_user_id: adminUser.id,
                action: JSON.stringify(action_req),
                payload:""
                }).then(()=>{
                });

                req.user = adminUser;
                return next();
        })
        .catch(next);
    },
    validateAdminUserOrSameUser: function(req, res, next) {
        if (!(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT')) return next(new Errors.Validation("No user token"));
        const data = auth.verifyJwt(req.headers.authorization.split(' ')[1])
        console.log('user!!!', data)
        if(data.valid !== 1) return next(new Errors.Validation("No user token"));
        db.AdminUser.findOne({where: {id: data.id},
            include: [{
                model: db.Role
            }]})
            .then((adminUser) => {
            if (!adminUser) return next(new Errors.Validation("User not exist"));
        const{url, body, params, method, originalUrl, baseUrl}=req;
        const action_req = {
            url: url,
            body: body,
            params: params,
            method: method,
            originalUrl:originalUrl,
            baseUrl:baseUrl
        }
        db.UserActivityLog.create({
            admin_user_id: adminUser.id,
            action: JSON.stringify(action_req),
            payload:""
        }).then();
        db.FeatureACL.findOne({where: {role_id: adminUser.role_id, feature_api_url: req.baseUrl}})
            .then((right) => {
                if(!right)  return next(new Errors.Validation("you are not a admin"));

                if(req.body['country_id'] || req.params['country_id']) {
                    const country_id = req.body['country_id']?req.body['country_id']:req.params['country_id'];
                    db.AdminuserCountry.findOne({where: {admin_user_id: adminUser.id, country_id: country_id}}).then((exist)=>{
                        if(!exist) return next(new Errors.Validation("you are not a admin --> country id"));
                    req.user = adminUser;
                    next();
                })
                } else {
                    req.user = adminUser;
                    next();
                }

        });
    })
        .catch(err => res.send({ err: err.message }));
    },
    checkAdminUserURLAuth: function(req, res, next){
        const adminUser = req.user;
        //const {country_id}= req.headers;
        if(!adminUser || !adminUser.Role || !adminUser.Role.FeatureACLs || adminUser.Role.FeatureACLs.length<=0||
            (adminUser.Role.FeatureACLs[0].dataValues.feature_api_url !== req.baseUrl)) {
            return next(new Errors.Validation("you are not a admin"));
        }

        if(req.body['country_id'] || req.params['country_id']) {
            const country_id = req.body['country_id']?req.body['country_id']:req.params['country_id'];
            db.AdminuserCountry.findOne({where: {admin_user_id: adminUser.id, country_id: country_id}}).then((exist)=>{
                if(!exist) return next(new Errors.Validation("you are not a admin --> country id"));
                 next();
            })
            .catch(next);
        }
             next();
    },
    checkAdminUserActionAuth: function(req, res, next){
        const adminUser = req.user;
        const {method} = req;

        if(!adminUser || !adminUser.Role || !adminUser.Role.FeatureACLs || adminUser.Role.FeatureACLs.length<=0||
 !adminUser.Role.FeatureACLs[0].dataValues.actions) {
            return next(new Errors.Validation("you are not a admin"));
        }

        //const actions = JSON.parse(adminUser.Role.FeatureACLs[0].dataValues.actions);
        if(!adminUser || !adminUser.Role || !adminUser.Role.FeatureACLs || !adminUser.Role.FeatureACLs[0].actions[method]) {
            return next(new Errors.Validation("you don't have permission for this action"));
        }
        /*req.actions= actions;
        if(adminUser.Role.FeatureACLs[0].fields){
            req.fields = JSON.parse(adminUser.Role.FeatureACLs[0].fields)
        }*/
        next();
    }
}
