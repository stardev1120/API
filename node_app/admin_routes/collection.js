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
const dictionary = require('../dictionary.json');


router.post('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {amount, date, currency, retry_date, status, loan_id} = req.body;

let query = {
    amount: amount,
    date: date,
    currency: currency,
    retry_date: retry_date,
    status: status,
    loan_id: loan_id
};

db.Collection.create(query)
    .then(collection => {
    res.send(collection);
})
.catch(err => res.send({err: err.message}))
})

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);
var attributes=[];
if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields){
    if(req.user.Role.FeatureACLs[0].fields['ALL']){
        attributes=['id', 'amount', 'date', 'currency', 'retry_date', 'status']
    } else {
        if (req.user.Role.FeatureACLs[0].fields['id']) {
            attributes.push('id');
        }
        if(req.user.Role.FeatureACLs[0].fields['amount']){
            attributes.push('amount');
        }
        if(req.user.Role.FeatureACLs[0].fields['date']){
            attributes.push('date');
        }
        if(req.user.Role.FeatureACLs[0].fields['currency']){
            attributes.push('currency');
        }
        if(req.user.Role.FeatureACLs[0].fields['retry_date']){
            attributes.push('retry_date');
        }
        if(req.user.Role.FeatureACLs[0].fields['status']){
            attributes.push('status');
        }
    }
}
db.Collection.findAll({attributes: attributes,
    offset: filter_1.offset,
    limit: filter_1.limit,
    where: filter_1.where,
    include:filter_1.include})
    .then((Collections) => {
    res.send(Collections)
})
.catch(err => next(err));
});

router.get('/count', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);
    db.Collection.findAll({where: filter_1.where,
    include:filter_1.include})
        .then((Collections) => {
            res.send({count: Collections.length})
        })
        .catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    var attributes=[];
    var include=[];
if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields) {
    if (req.user.Role.FeatureACLs[0].fields['ALL']) {
        attributes = ['id','amount', 'date', 'currency', 'retry_date', 'status', 'loan_id']
        include = [
            {
                model: db.Loan,
                include: [{
                        model: db.User,
                        include: [{model: db.Country}]
                }]
            }
        ]
    } else {
        if (req.user.Role.FeatureACLs[0].fields['id']) {
            attributes.push('id');
        }
        if (req.user.Role.FeatureACLs[0].fields['amount']) {
            attributes.push('amount');
        }
        if (req.user.Role.FeatureACLs[0].fields['date']) {
            attributes.push('date');
        }
        if (req.user.Role.FeatureACLs[0].fields['currency']) {
            attributes.push('currency');
        }
        if (req.user.Role.FeatureACLs[0].fields['retry_date']) {
            attributes.push('retry_date');
        }
        if (req.user.Role.FeatureACLs[0].fields['status']) {
            attributes.push('status');
        }
        if (req.user.Role.FeatureACLs[0].fields['loan']) {
            attributes.push('loan_id');
            include .push({
                    model: db.Loan,
                    include: [{
                    model: db.User,
                    include: [{model: db.Country}]
                    }]
                })
        }     

    }
}
    db.Collection.findOne({attributes: attributes, where: {
        id: req.params['id']
    },
        include:include})
        .then((collection) => {
        res.send(collection)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {amount, date, currency, retry_date, status} = req.body;

db.Collection.findOne({where: {id: req.params['id']}})
    .then((collection) => {
    if(!collection) return next(new Errors.Validation("collection is not existed"));
if(req.user.Role.FeatureACLs[0].fields['amount'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    collection.amount = amount;
}
if(req.user.Role.FeatureACLs[0].fields['date'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    collection.date = date;
}
if(req.user.Role.FeatureACLs[0].fields['currency'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    collection.currency = currency;
}
if(req.user.Role.FeatureACLs[0].fields['retry_date'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    collection.retry_date = retry_date;
}
if(req.user.Role.FeatureACLs[0].fields['status'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    collection.status = status;
}

collection.save()
    .then(collection => res.send(collection));
})
.catch(err => next(err));
});

router.put('/collect-money/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {

    db.Collection.findOne({
        where: {id: req.params['id']},
    include:[
        {
            model:db.Loan,
            include:[{
                model:db.User
            }]
        }
    ]
    })
    .then((collection) => {
    if(!collection) return next(new Errors.Validation("collection is not existed"));
    var collectionHistory = {
        amount: collection.amount,
        date: collection.created_at,
        currency: collection.currency,
        retry_date: collection.retry_date,
        status: collection.status,
        date_of_entry: collection.date_of_entry,
        bank_response: '',
        loan_id: collection.loan_id,
        collection_id: collection.id,
        admin_user_id: req.user.id
    };
    db.CollectionHistory.create(collectionHistory).then((collectionHistoryObj)=>{
        collection.status = 'Collected';
    collection.save().then((collectionObj)=> {
        sequelize.sequelize.query('Select sum(amount_available) as sum from CountryInvestments where status =\'Active\' and country_id='+collection.Loan.User.country_id+' ;',
        {model: db.CountryInvestment}).then((result)=>{
        var sum = JSON.parse(JSON.stringify(result))
        sequelize.sequelize.query('Update CountryInvestments set status = \'Disabled\' where status =\'Active\' and country_id='+collection.Loan.User.country_id+' ;').then((updated)=> {
        var countryInvestment = {
            amount_available: parseInt(sum[0].sum)+parseInt(collectionObj.amount),
            country_id: collection.Loan.User.country_id,
            loan_id: collection.loan_id,
            status: 'Active'
        }
        db.CountryInvestment.create(countryInvestment).then((countryInvestmentObj) => {
            var adminCollectDistributes ={
                transactionType: 'Collect Money',
                amount: collectionObj.amount,
                loan_id: collection.loan_id,
                admin_user_id: req.user.id
            }
            db.AdminCollectDistribute.create(adminCollectDistributes)
            .then(()=>{
                var amount_pending = parseInt(collection.Loan.amount_pending) - parseInt(collection.amount);
                collection.Loan.amount_pending = amount_pending;
                if(amount_pending <=0){
                    collection.Loan.status = 'Closed';
                }
                collection.Loan.save().then(()=>{
                  db.User.findOne({where:{id:collection.Loan.user_id}})
                    .then((user)=>{
                        user.available_amount=parseInt(user.available_amount)+ parseInt(collection.Loan.ammount_taken);
                        user.no_of_active_loans = user.no_of_active_loans  - 1;
                        user.save().then(()=>{
                            res.send(collectionObj);
                        })
                    })
                })
            })
        })
    })
})
})
    })
    })
    .catch(err => next(err));
});

router.delete('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.Collection.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
