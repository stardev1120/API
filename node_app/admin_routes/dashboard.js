'use strict'
const db = require('../models');
const sequelize = require('../models');
const geoip = require('geoip-lite');
const randomstring = require('randomstring');
const helper = require('../helper');
const auth = require('../helper/auth');
const Errors = require('../errors');
const middlewares = require('../middlewares');
const router = require('express').Router();
const dictionary = require('../dictionary.json')
const sendMail = require('../helper/sendMail');
const _ = require('lodash');


router.post('/users-per-date', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id, start_date, end_date} = req.body;
    var filter = {};
    var whereClause = 'WHERE';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += ' country_id= :country_id ';
    }
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' created_at>= :start_date ';
    }
	and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' created_at <= :end_date ';
    }
    if (whereClause === 'WHERE') {
        whereClause = '';
    }

    var query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\', COUNT(*) as \'value\'\n' +
        'FROM Users\n' +
        'GROUP BY  MONTHNAME(created_at);', {model: db.User});

	var count = sequelize.sequelize.query('SELECT COUNT(*) as \'count\'\n' +
        'FROM Users;', {model: db.User});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\', COUNT(*) as \'value\'\n' +
            'FROM Users\n' +
            whereClause+'\n' +
            'GROUP BY  MONTHNAME(created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );

        count = sequelize.sequelize.query('SELECT COUNT(*) as \'count\'\n' +
            'FROM Users\n' +
            whereClause+'\n' +
            ';', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }

    Promise.all([query, count]).then((result)=>{
        var countObj = JSON.parse(JSON.stringify(result))
        var resultArr1 = _.map(result[0], function(n){

            var key = 'key';
            var nObj = JSON.parse(JSON.stringify(n))
            return nObj[key]
        })
        var resultArr2 = _.map(result[0], function(n){
            var value = 'value';
            var nObj = JSON.parse(JSON.stringify(n))
            return nObj[value]
        })
        var resultArr3 = []
        resultArr3.push(resultArr1)
        resultArr3.push(resultArr2)
        res.json({data: resultArr3, count: countObj[1]})
            next()
    }).catch((error)=> next(error));
});

router.post('/loans-per-date', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id, start_date, end_date} = req.body;
var filter = {};
var whereClause = 'WHERE';

if (country_id) {
    filter.country_id = country_id;
    whereClause += ' country_id= :country_id ';
}
var and = whereClause !== 'WHERE' ? ' and ' : '';
if (start_date) {
    filter.start_date = start_date;
    whereClause += and + ' loans.created_at>= :start_date ';
}
and = whereClause !== 'WHERE' ? ' and ' : '';
if (end_date) {
    filter.end_date = end_date;
    whereClause += and + ' loans.created_at <= :end_date ';
}
if (whereClause === 'WHERE') {
    whereClause = '';
}

var query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\', COUNT(*) as \'value\'\n' +
    'FROM Loans\n' +
    'GROUP BY  MONTHNAME(created_at);', {model: db.Loan});
var count = sequelize.sequelize.query('SELECT COUNT(*) as \'count\'\n' +
    'FROM Loans;', {model: db.Loan});

if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
    query = sequelize.sequelize.query('SELECT  MONTHNAME(loans.created_at) as \'key\', COUNT(loans.id) as \'value\'\n' +
        'FROM Loans as loans\n' +
        'inner join Users as users on loans.user_id = users.id  \n'+
        whereClause+'\n' +
        'GROUP BY  MONTHNAME(loans.created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );

    count = sequelize.sequelize.query('SELECT COUNT(loans.id) as \'count\'\n' +
        'FROM Loans as loans\n' +
        'inner join Users as users on loans.user_id = users.id  \n'+
        whereClause+'\n' +
        ';', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
}

Promise.all([query, count]).then((result)=>{
    var countObj = JSON.parse(JSON.stringify(result))
    var resultArr1 = _.map(result[0], function(n){

        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[key]
    })
    var resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[value]
    })
    var resultArr3 = []
    resultArr3.push(resultArr1)
resultArr3.push(resultArr2)
res.json({data: resultArr3, count: countObj[1]})
next()
}).catch((error)=> next(error));
});

router.post('/collections-per-date', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id, start_date, end_date} = req.body;
var filter = {};
var whereClause = 'WHERE';

if (country_id) {
    filter.country_id = country_id;
    whereClause += ' country_id= :country_id ';
}
var and = whereClause !== 'WHERE' ? ' and ' : '';
if (start_date) {
    filter.start_date = start_date;
    whereClause += and + ' collections.created_at>= :start_date ';
}
and = whereClause !== 'WHERE' ? ' and ' : '';
if (end_date) {
    filter.end_date = end_date;
    whereClause += and + ' collections.created_at <= :end_date ';
}
if (whereClause === 'WHERE') {
    whereClause = '';
}
var query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\', COUNT(*) as \'value\'\n' +
    'FROM Collections\n' +
    'GROUP BY  MONTHNAME(created_at);', {model: db.Collection});
var count = sequelize.sequelize.query('SELECT COUNT(*) as \'count\'\n' +
    'FROM Collections;', {model: db.Collection});
if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
    query = sequelize.sequelize.query('SELECT  MONTHNAME(collections.created_at) as \'key\', COUNT(collections.id) as \'value\'\n' +
        'FROM Collections as collections\n' +
        'inner join Loans as loans on  collections.loan_id = loans.id \n'+
        'inner join Users as users on loans.user_id = users.id  \n'+
        whereClause+'\n' +
        'GROUP BY  MONTHNAME(collections.created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );

    count = sequelize.sequelize.query('SELECT COUNT(collections.id) as \'count\'\n' +
        'FROM Collections as collections\n' +
        'inner join Loans as loans on  collections.loan_id = loans.id \n'+
        'inner join Users as users on loans.user_id = users.id  \n'+
        whereClause+'\n' +
        ';', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
}
Promise.all([query, count]).then((result)=>{
    var countObj = JSON.parse(JSON.stringify(result))
    var resultArr1 = _.map(result[0], function(n){

        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[key]
    })
    var resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[value]
    })
    var resultArr3 = []
    resultArr3.push(resultArr1)
resultArr3.push(resultArr2)
res.json({data: resultArr3, count: countObj[1]})
next()
}).catch((error)=> next(error));
});

router.post('/issued-amount-per-date', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id, start_date, end_date} = req.body;
var filter = {};
var whereClause = 'WHERE loans.status = \'Active\'';
var and = whereClause !== 'WHERE' ? ' and ' : '';
if (country_id) {
    filter.country_id = country_id;
    whereClause += and + ' users.country_id= :country_id ';
}
and = whereClause !== 'WHERE' ? ' and ' : '';
if (start_date) {
    filter.start_date = start_date;
    whereClause += and + ' loans.created_at>= :start_date ';
}
and = whereClause !== 'WHERE' ? ' and ' : '';
if (end_date) {
    filter.end_date = end_date;
    whereClause += and + ' loans.created_at <= :end_date ';
}
if (whereClause === 'WHERE') {
    whereClause = '';
}
    var query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as\'key\', SUM(amount_taken) as \'value\'\n' +
    'FROM Loans\n' +
    'where status = \'Active\'\n' +
    'GROUP BY  MONTHNAME(created_at);', {model: db.Loan});
var count = sequelize.sequelize.query('SELECT SUM(amount_taken) as \'sum\'\n' +
    'FROM Loans \n'+
    'where status = \'Active\';', {model: db.Loan});
if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
    query = sequelize.sequelize.query('SELECT  MONTHNAME(loans.created_at) as \'key\', SUM(amount_taken) as \'value\'\n' +
        'FROM Loans as loans\n' +
        'inner join Users as users on loans.user_id = users.id  \n'+
        whereClause+'\n' +
        'GROUP BY  MONTHNAME(loans.created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );

    count = sequelize.sequelize.query('SELECT SUM(amount_taken) as \'sum\'\n' +
        'FROM Loans as loans\n' +
        'inner join Users as users on loans.user_id = users.id  \n'+
        whereClause+'\n' +
        ';', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
}
Promise.all([query, count]).then((result)=>{
    var countObj = JSON.parse(JSON.stringify(result))
    var resultArr1 = _.map(result[0], function(n){

        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[key]
    })
    var resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[value]
    })
    var resultArr3 = []
    resultArr3.push(resultArr1)
resultArr3.push(resultArr2)
res.json({data: resultArr3, sum: countObj[1]})
next()
}).catch((error)=> next(error));
});

router.post('/collected-amount-per-date', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id, start_date, end_date} = req.body;
var filter = {};
var whereClause = 'WHERE collections.status = \'Collected\'';
var and = whereClause !== 'WHERE' ? ' and ' : '';
if (country_id) {
    filter.country_id = country_id;
    whereClause += and + ' country_id= :country_id ';
}
and = whereClause !== 'WHERE' ? ' and ' : '';
if (start_date) {
    filter.start_date = start_date;
    whereClause += and + ' collections.created_at>= :start_date ';
}
and = whereClause !== 'WHERE' ? ' and ' : '';
if (end_date) {
    filter.end_date = end_date;
    whereClause += and + ' collections.created_at <= :end_date ';
}
if (whereClause === 'WHERE') {
    whereClause = '';
}
    var query = sequelize.sequelize.query('SELECT  MONTHNAME(collections.created_at) as\'key\', SUM(amount) as \'value\'\n' +
    'FROM Collections\n' +
    'where status = \'Collected\'\n' +
    'GROUP BY  MONTHNAME(collections.created_at);', {model: db.Loan});
var count = sequelize.sequelize.query('SELECT SUM(amount) as \'sum\'\n' +
    'FROM Collections \n'+
    'where collections.status = \'Collected\';', {model: db.Loan});
if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
    query = sequelize.sequelize.query('SELECT  MONTHNAME(collections.created_at) as \'key\', SUM(amount) as \'value\'\n' +
        'FROM Collections as collections\n' +
        'inner join Loans as loans on  collections.loan_id = loans.id \n'+
        'inner join Users as users on loans.user_id = users.id  \n'+
        whereClause+'\n' +
        'GROUP BY  MONTHNAME(collections.created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );

    count = sequelize.sequelize.query('SELECT SUM(amount) as \'sum\'\n' +
        'FROM Collections as collections\n' +
        'inner join Loans as loans on  collections.loan_id = loans.id \n'+
        'inner join Users as users on loans.user_id = users.id  \n'+
        whereClause+'\n' +
        ';', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
}
Promise.all([query, count]).then((result)=>{
    var countObj = JSON.parse(JSON.stringify(result))
    var resultArr1 = _.map(result[0], function(n){

        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[key]
    })
    var resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[value]
    })
    var resultArr3 = []
    resultArr3.push(resultArr1)
resultArr3.push(resultArr2)
res.json({data: resultArr3, sum: countObj[1]})
next()
}).catch((error)=> next(error));
});

router.post('/avg-uscore-per-date', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id, start_date, end_date} = req.body;
var filter = {};
var whereClause = 'WHERE';

if (country_id) {
    filter.country_id = country_id;
    whereClause += ' country_id= :country_id ';
}
var and = whereClause !== 'WHERE' ? ' and ' : '';
if (start_date) {
    filter.start_date = start_date;
    whereClause += and + ' created_at>= :start_date ';
}
and = whereClause !== 'WHERE' ? ' and ' : '';
if (end_date) {
    filter.end_date = end_date;
    whereClause += and + ' created_at <= :end_date ';
}
if (whereClause === 'WHERE') {
    whereClause = '';
}
    var query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as\'key\',  ROUND(AVG(umbrella_score) ) as \'value\'\n' +
    'FROM Users\n' +
    'GROUP BY  MONTHNAME(created_at);', {model: db.User});
var count = sequelize.sequelize.query('SELECT  ROUND(AVG(umbrella_score) ) as \'avg\'\n' +
    'FROM Users;', {model: db.User});

if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
    query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\',  ROUND(AVG(umbrella_score) ) as \'value\'\n' +
        'FROM Users\n' +
        whereClause+'\n' +
        'GROUP BY  MONTHNAME(created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );

    count = sequelize.sequelize.query('SELECT  ROUND(AVG(umbrella_score) ) as \'avg\'\n' +
        'FROM Users\n' +
        whereClause+'\n' +
        ';', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
}

Promise.all([query, count]).then((result)=>{
    var countObj = JSON.parse(JSON.stringify(result))
    var resultArr1 = _.map(result[0], function(n){

        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[key]
    })
    var resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[value]
    })
    var resultArr3 = []
    resultArr3.push(resultArr1)
resultArr3.push(resultArr2)
res.json({data: resultArr3, avg: countObj[1]})
next()
}).catch((error)=> next(error));
});

router.post('/otp-user-per-date', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id, start_date, end_date} = req.body;
var filter = {};
var whereClause = 'WHERE';

if (country_id) {
    filter.country_id = country_id;
    whereClause += ' country_id= :country_id ';
}
var and = whereClause !== 'WHERE' ? ' and ' : '';
if (start_date) {
    filter.start_date = start_date;
    whereClause += and + ' adminUserAccesses.created_at>= :start_date ';
}
and = whereClause !== 'WHERE' ? ' and ' : '';
if (end_date) {
    filter.end_date = end_date;
    whereClause += and + ' adminUserAccesses.created_at <= :end_date ';
}
if (whereClause === 'WHERE') {
    whereClause = '';
}
    var query = sequelize.sequelize.query('SELECT   MONTHNAME(created_at) as\'key\',count(distinct  user_id ) as \'value\'\n' +
    'FROM AdminUserAccesses\n' +
    'GROUP BY MONTHNAME(created_at);', {model: db.AdminUserAccesse});
var count = sequelize.sequelize.query('SELECT  count(distinct  user_id ) as \'count\'\n' +
    'FROM AdminUserAccesses;', {model: db.AdminUserAccesse});

if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
    query = sequelize.sequelize.query('SELECT  MONTHNAME(adminUserAccesses.created_at) as \'key\', count(distinct  user_id ) as \'value\'\n' +
        'FROM AdminUserAccesses as adminUserAccesses\n' +
        'inner join Users as users on adminUserAccesses.user_id = users.id  \n'+
        whereClause+'\n' +
        'GROUP BY  MONTHNAME(adminUserAccesses.created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );

    count = sequelize.sequelize.query('SELECT count(distinct  user_id ) as \'count\'\n' +
        'FROM AdminUserAccesses as adminUserAccesses\n' +
        'inner join Users as users on adminUserAccesses.user_id = users.id  \n'+
        whereClause+'\n' +
        ';', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
}

Promise.all([query, count]).then((result)=>{
    var countObj = JSON.parse(JSON.stringify(result))
    var resultArr1 = _.map(countObj[0], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(n))))
        return nObj[key]
    })
    var resultArr2 = _.map(countObj[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[value]
    })
    var resultArr3 = []
    resultArr3.push(resultArr1)
resultArr3.push(resultArr2)
res.json({data: resultArr3, count: countObj[1][0]})
next()
}).catch((error)=> next(error));
});

router.post('/unverified-users-per-date', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id, start_date, end_date} = req.body;
var filter = {};
var whereClause = 'WHERE verified=0';

var and = whereClause !== 'WHERE' ? ' and ' : '';
if (country_id) {
    filter.country_id = country_id;
    whereClause += and + ' country_id= :country_id ';
}
and = whereClause !== 'WHERE' ? ' and ' : '';
if (start_date) {
    filter.start_date = start_date;
    whereClause += and + ' created_at>= :start_date ';
}
and = whereClause !== 'WHERE' ? ' and ' : '';
if (end_date) {
    filter.end_date = end_date;
    whereClause += and + ' created_at <= :end_date ';
}
if (whereClause === 'WHERE') {
    whereClause = '';
}
var query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\', COUNT(*) as \'value\'\n' +
    'FROM Users\n' +
    'WHERE verified=0 \n'+
    'GROUP BY  MONTHNAME(created_at);', {model: db.User});
var count = sequelize.sequelize.query('SELECT COUNT(*) as \'count\'\n' +
    'FROM Users\n' +
    'WHERE verified=0;', {model: db.User});
if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
    query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\',  COUNT(*) as \'value\'\n' +
        'FROM Users\n' +
        whereClause+'\n' +
        'GROUP BY  MONTHNAME(created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );

    count = sequelize.sequelize.query('SELECT  COUNT(*) as \'count\'\n' +
        'FROM Users\n' +
        whereClause+'\n' +
        ';', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
}

Promise.all([query, count]).then((result)=>{
    var countObj = JSON.parse(JSON.stringify(result))
    var resultArr1 = _.map(result[0], function(n){

        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[key]
    })
    var resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[value]
    })
    var resultArr3 = []
    resultArr3.push(resultArr1)
resultArr3.push(resultArr2)
res.json({data: resultArr3, count: countObj[1]})
next()
}).catch((error)=> next(error));
});

router.post('/left-money-per-date', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id, start_date, end_date} = req.body;
var filter = {};
var whereClause = 'WHERE';

if (country_id) {
    filter.country_id = country_id;
    whereClause += ' country_id= :country_id ';
}
var and = whereClause !== 'WHERE' ? ' and ' : '';
if (start_date) {
    filter.start_date = start_date;
    whereClause += and + ' created_at>= :start_date ';
}
and = whereClause !== 'WHERE' ? ' and ' : '';
if (end_date) {
    filter.end_date = end_date;
    whereClause += and + ' created_at <= :end_date ';
}
if (whereClause === 'WHERE') {
    whereClause = '';
}
var query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\', SUM(amount_available) as \'value\'\n' +
    'FROM CountryInvestments\n' +
    'GROUP BY  MONTHNAME(created_at);', {model: db.CountryInvestment});
var count = sequelize.sequelize.query('SELECT  SUM(amount_available) as \'sum\'\n' +
    'FROM CountryInvestments;', {model: db.CountryInvestment});
if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
    query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\',  SUM(amount_available) as \'value\'\n' +
        'FROM CountryInvestments\n' +
        whereClause+'\n' +
        'GROUP BY  MONTHNAME(created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );

    count = sequelize.sequelize.query('SELECT  SUM(amount_available) as \'sum\'\n' +
        'FROM CountryInvestments\n' +
        whereClause+'\n' +
        ';', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
}
Promise.all([query, count]).then((result)=>{
    var countObj = JSON.parse(JSON.stringify(result))
    var resultArr1 = _.map(result[0], function(n){

        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[key]
    })
    var resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[value]
    })
    var resultArr3 = []
    resultArr3.push(resultArr1)
resultArr3.push(resultArr2)
res.json({data: resultArr3, sum: countObj[1]})
next()
}).catch((error)=> next(error));
});

router.post('/investment-status-per-date', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id, start_date, end_date} = req.body;
var query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\', count(status) as \'value\'\n' +
    '    FROM CountryInvestments\n' +
    '    GROUP BY  MONTHNAME(created_at);', {model: db.CountryInvestment});
var count = sequelize.sequelize.query('SELECT  COUNT(status) as \'count\'\n' +
    'FROM CountryInvestments;', {model:


db.CountryInvestment});

Promise.all([query, count]).then((result)=>{
    var countObj = JSON.parse(JSON.stringify(result))
    var resultArr1 = _.map(result[0], function(n){

        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[key]
    })
    var resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n))
        return nObj[value]
    })
    var resultArr3 = []
    resultArr3.push(resultArr1)
resultArr3.push(resultArr2)
res.json({data: resultArr3, count: countObj[1]})
next()
}).catch((error)=> next(error));
});

router.post('/users-loans-collections-per-date', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, function(req, res, next) {
    const {country_id, start_date, end_date} = req.body;
    var usersCountPerMonth = getUsersCountPerMonth(country_id, start_date, end_date);
    var loansCountPerMonth = getLoansCountPerMonth(country_id, start_date, end_date);
    var collectionsCountPerMonth = getCollectionsCountPerMonth(country_id, start_date, end_date);

    Promise.all([usersCountPerMonth, loansCountPerMonth, collectionsCountPerMonth]).then(function (result) {
        var countObj = JSON.parse(JSON.stringify(result));

        var arrayFlat = _.uniq(_.flatten(countObj));
        var arrayResult = [];
        _.each(arrayFlat, function (i) {
            var item = _.cloneDeep(i);

            if (arrayResult.length === 0) {
                arrayResult.push(item)
            } else {
                var itemObj = _.filter(arrayResult, function (obj) {
                    return obj['key'] === item['key']
                })
                if (!itemObj || itemObj.length <= 0) {
                    arrayResult.push(item)
                } else {
                    var keys = _.keys(item)


                    if (keys.length > 1) {
                        var valueKey = keys[1]
                        if (itemObj.length === 1) {
                            itemObj[0][valueKey] = item[valueKey]
                        }
                    }
                }
            }
        });
        res.json({data: arrayResult})
        next()
    }).catch(function (error){
    return next(error)
    });
});

var getUsersCountPerMonth = function(country_id, start_date, end_date){
    var filter = {};
    var whereClause = 'WHERE';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += ' country_id= :country_id ';
    }
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' created_at>= :start_date ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' created_at <= :end_date ';
    }
    if (whereClause === 'WHERE') {
        whereClause = '';
    }

    var query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\', COUNT(*) as \'users\'\n' +
        'FROM Users\n' +
        'GROUP BY  MONTHNAME(created_at);', {model: db.User});
    
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\', COUNT(*) as \'users\'\n' +
            'FROM Users\n' +
            whereClause+'\n' +
            'GROUP BY  MONTHNAME(created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    
    return query;
};

var getLoansCountPerMonth = function(country_id, start_date, end_date) {
    var filter = {};
    var whereClause = 'WHERE';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += ' country_id= :country_id ';
    }
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' loans.created_at>= :start_date ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' loans.created_at <= :end_date ';
    }
    if (whereClause === 'WHERE') {
        whereClause = '';
    }

    var query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\', COUNT(*) as \'loans\'\n' +
        'FROM Loans\n' +
        'GROUP BY  MONTHNAME(created_at);', {model: db.Loan});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  MONTHNAME(loans.created_at) as \'key\', COUNT(loans.id) as \'loans\'\n' +
            'FROM Loans as loans\n' +
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  MONTHNAME(loans.created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};

var getCollectionsCountPerMonth = function (country_id, start_date, end_date) {
    var filter = {};
    var whereClause = 'WHERE';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += ' country_id= :country_id ';
    }
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' collections.created_at>= :start_date ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' collections.created_at <= :end_date ';
    }
    if (whereClause === 'WHERE') {
        whereClause = '';
    }
    var query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as \'key\', COUNT(*) as \'collections\'\n' +
        'FROM Collections\n' +
        'GROUP BY  MONTHNAME(created_at);', {model: db.Collection});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  MONTHNAME(collections.created_at) as \'key\', COUNT(collections.id) as \'collections\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  MONTHNAME(collections.created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};


router.post('/users-loans-collections-amount-per-date', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, function(req, res, next) {
    const {country_id, start_date, end_date} = req.body;
    var usersCountPerMonth = getUsersCountPerMonth(country_id, start_date, end_date);
    var loansAmountPerMonth = getLoansAmountPerMonth(country_id, start_date, end_date);
    var collectionsAmountPerMonth = getCollectionsAmountPerMonth(country_id, start_date, end_date);

    Promise.all([usersCountPerMonth, loansAmountPerMonth, collectionsAmountPerMonth]).then(function (result) {
        var countObj = JSON.parse(JSON.stringify(result));

        var arrayFlat = _.uniq(_.flatten(countObj));
        var arrayResult = [];
        _.each(arrayFlat, function (i) {
            var item = _.cloneDeep(i);

            if (arrayResult.length === 0) {
                arrayResult.push(item)
            } else {
                var itemObj = _.filter(arrayResult, function (obj) {
                    return obj['key'] === item['key']
                })
                if (!itemObj || itemObj.length <= 0) {
                    arrayResult.push(item)
                } else {
                    var keys = _.keys(item);
                    if (keys.length > 1) {
                        var valueKey = keys[1];
                        if (itemObj.length === 1) {
                            itemObj[0][valueKey] = item[valueKey]
                        }
                    }
                }
            }
        });
        res.json({data: arrayResult})
        next()
    }).catch(function (error){
        return next(error)
    });
});

var getLoansAmountPerMonth = function(country_id, start_date, end_date) {
    var filter = {};
    var whereClause = 'WHERE loans.status = \'Active\'';
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' loans.created_at>= :start_date ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' loans.created_at <= :end_date ';
    }
    if (whereClause === 'WHERE') {
        whereClause = '';
    }
    var query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as\'key\', SUM(amount_taken) as \'loans\'\n' +
        'FROM Loans\n' +
        'where status = \'Active\'\n' +
        'GROUP BY  MONTHNAME(created_at);', {model: db.Loan});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  MONTHNAME(loans.created_at) as \'key\', SUM(amount_taken) as \'loans\'\n' +
            'FROM Loans as loans\n' +
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  MONTHNAME(loans.created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};

var getCollectionsAmountPerMonth = function (country_id, start_date, end_date) {
    var filter = {};
    var whereClause = 'WHERE collections.status = \'Collected\'';
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' country_id= :country_id ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' collections.created_at>= :start_date ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' collections.created_at <= :end_date ';
    }
    if (whereClause === 'WHERE') {
        whereClause = '';
    }
    var query = sequelize.sequelize.query('SELECT  MONTHNAME(created_at) as\'key\', SUM(amount) as \'collections\'\n' +
        'FROM Collections\n' +
        'where status = \'Collected\'\n' +
        'GROUP BY  MONTHNAME(created_at);', {model: db.Loan});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  MONTHNAME(collections.created_at) as \'key\', SUM(amount) as \'collections\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  MONTHNAME(collections.created_at);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
router.post('/revenue-per-date', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, function (req, res, next) {
    const {country_id, start_date, end_date} = req.body;
var filter = {};
var whereClause = 'WHERE loans.status = \'active\'\n' ;
var and = whereClause !== 'WHERE' ? ' and ' : '';
if (country_id) {
    filter.country_id = country_id;
    whereClause += ' country_id= :country_id ';
}
 and = whereClause !== 'WHERE' ? ' and ' : '';
if (start_date) {
    filter.start_date = start_date;
    whereClause += and + ' loans.created_at>= :start_date ';
}
and = whereClause !== 'WHERE' ? ' and ' : '';
if (end_date) {
    filter.end_date = end_date;
    whereClause += and + ' loans.created_at <= :end_date ';
}
if (whereClause === 'WHERE') {
    whereClause = '';
}

var query = sequelize.sequelize.query('select  Date(date_taken) as \'key\', sum(ROUND((((duration_of_loan/365)*interest_rate*amount_taken)-service_fee), 2)) as \'value\'\n' +
    'from Loans\n' +
    'where status = \'active\'\n' +
    'group by Date(date_taken);', {model: db.Loan});
var count = sequelize.sequelize.query('select  sum(ROUND((((duration_of_loan/365)*interest_rate*amount_taken)-service_fee), 2)) as \'sum\'\n' +
    'from Loans\n' +
    'where status = \'active\';', {model: db.Loan});

if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
    query = sequelize.sequelize.query('select   Date(loans.date_taken) as \'key\', sum(ROUND((((duration_of_loan/365)*interest_rate*amount_taken)-service_fee), 2)) as \'value\'\n' +
        'FROM Loans as loans\n' +
        'inner join Users as users on loans.user_id = users.id  \n'+
        whereClause+'\n' +
        'GROUP BY  Date(loans.date_taken);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );

    count = sequelize.sequelize.query('select  sum(ROUND((((duration_of_loan/365)*interest_rate*amount_taken)-service_fee), 2)) as \'sum\'\n' +
        'FROM Loans as loans\n' +
        'inner join Users as users on loans.user_id = users.id  \n'+
        whereClause+'\n' +
        ';', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
}

    Promise.all([query, count]).then(function (result) {
        var countObj = JSON.parse(JSON.stringify(result))
        var resultArr1 = _.map(result[0], function (n) {
            var subArray = [];
            var key = 'key';
            var value = 'value';
            var nObj = JSON.parse(JSON.stringify(n))
            subArray.push(nObj[key])
            subArray.push(nObj[value])
            return subArray
        })
        var resultArr2 = _.map(result[0], function (n) {
            var nObj = JSON.parse(JSON.stringify(n))
            return
        })
        res.json({data: resultArr1, sum: countObj[1]})
        next()
    }).catch((error){return next(error)});
});

module.exports = router;

