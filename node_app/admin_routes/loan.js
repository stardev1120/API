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
    const {date_taken, ammount_taken, service_fee, interest_rate, duration_of_loan, status, amount_pending,
        bank_credit_transaction, bank_credit_status, currency, user_id, user_payment_method_id} = req.body;

let query = {
    date_taken: date_taken,
    ammount_taken: ammount_taken,
    service_fee: service_fee,
    interest_rate: interest_rate,
    duration_of_loan: duration_of_loan,
    status: status,
    amount_pending: amount_pending,
    bank_credit_transaction: bank_credit_transaction,
    bank_credit_status: bank_credit_status,
    currency: currency,
    user_id: user_id,
    user_payment_method_id: user_payment_method_id};

db.Loan.create(query)
    .then(loan => {
    res.send(loan);
})
.catch(err => res.send({err: err.message}))
});

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);
var attributes=[]
/*if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields){
    if(req.user.Role.FeatureACLs[0].fields['COLLECTION'] || req.user.Role.FeatureACLs[0].fields['ALL']){
        include.push({
            model: db.Collection
        })
    }
    if(req.user.Role.FeatureACLs[0].fields['USER'] || req.user.Role.FeatureACLs[0].fields['ALL']){
        include.push({
            model: db.User,
            where: filter_1.where.user_id?{id:filter_1.where.user_id}:{},
            include: [{
                model:db.Country,
                where:filterCountry
            }]
        })
    }

    if(req.user.Role.FeatureACLs[0].fields['UserPaymentMethod'] || req.user.Role.FeatureACLs[0].fields['ALL']){
        include.push(
            {
                model: db.UserPaymentMethod
            })
    }*/

    if(req.user.Role.FeatureACLs[0].fields['ALL']){
        attributes=['id', 'date_taken', 'ammount_taken', 'service_fee', 'interest_rate', 'duration_of_loan', 'status', 'amount_pending',
            'bank_credit_transaction', 'bank_credit_status', 'currency', 'admin_user_id']
    } else {
        if (req.user.Role.FeatureACLs[0].fields['id']) {
            attributes.push('id');
        }
        if(req.user.Role.FeatureACLs[0].fields['date_taken'] ){
            attributes.push('date_taken');
        }
        if(req.user.Role.FeatureACLs[0].fields['ammount_taken'] ){
            attributes.push('ammount_taken');
        }
        if(req.user.Role.FeatureACLs[0].fields['service_fee'] ){
            attributes.push('service_fee');
        }
        if(req.user.Role.FeatureACLs[0].fields['interest_rate'] ){
            attributes.push('interest_rate');
        }
        if(req.user.Role.FeatureACLs[0].fields['duration_of_loan'] ){
            attributes.push('duration_of_loan');
        }
        if(req.user.Role.FeatureACLs[0].fields['status'] ){
            attributes.push('status');
        }
        if(req.user.Role.FeatureACLs[0].fields['amount_pending'] ){
            attributes.push('amount_pending');
        }
        if(req.user.Role.FeatureACLs[0].fields['bank_credit_transaction'] ){
            attributes.push('bank_credit_transaction');
        }
        if(req.user.Role.FeatureACLs[0].fields['bank_credit_status'] ){
            attributes.push('bank_credit_status');
        }
        if(req.user.Role.FeatureACLs[0].fields['currency']){
            attributes.push('currency');
        }
        if(req.user.Role.FeatureACLs[0].fields['admin_user_id'] ){
            attributes.push('admin_user_id');
        }
    }
//}
db.Loan.findAll({attributes: attributes,
    offset: filter_1.offset,
    limit: filter_1.limit,
    where: filter_1.where,
    include:filter_1.include
})
    .then((loans) => {
    res.send(loans)
})
.catch(err => next(err));
});

router.get('/count', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);
    db.Loan.findAll({where:filter_1.where,
    include:filter_1.include})
        .then((loans) => {
            res.send({count: loans.length})
        })
        .catch(err => next(err));
});

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {country_id}=req.headers;

var filterCountry = {
}
if(country_id){
    filterCountry.id = country_id
}
var include = [];
var attributes=[];
if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields){
    if(req.user.Role.FeatureACLs[0].fields['COLLECTION'] || req.user.Role.FeatureACLs[0].fields['ALL']){
        include.push({
            model: db.Collection,
as: 'Collection'
        })
    }
    if(req.user.Role.FeatureACLs[0].fields['USER'] || req.user.Role.FeatureACLs[0].fields['ALL']){
        include.push({
            model: db.User,
            include: [{
                model:db.Country,
                where:filterCountry
            }]
        })
    }

    if(req.user.Role.FeatureACLs[0].fields['UserPaymentMethod'] || req.user.Role.FeatureACLs[0].fields['ALL']){
        include.push(
            {
                model: db.UserPaymentMethod
            })
    }

    /*if(req.user.Role.FeatureACLs[0].fields['LoansHistory'] || req.user.Role.FeatureACLs[0].fields['ALL']){
        include.push(
            {
                model: db.LoansHistory
            })
    }*/

    if(req.user.Role.FeatureACLs[0].fields['ALL']){
        attributes=['id', 'date_taken', 'ammount_taken', 'service_fee', 'interest_rate', 'duration_of_loan', 'status', 'amount_pending',
            'bank_credit_transaction', 'bank_credit_status', 'currency', 'user_id', 'created_at']
    } else {
        if (req.user.Role.FeatureACLs[0].fields['id']) {
            attributes.push('id');
        }
        if(req.user.Role.FeatureACLs[0].fields['date_taken']){
            attributes.push('date_taken');
        }
        if(req.user.Role.FeatureACLs[0].fields['ammount_taken']){
            attributes.push('ammount_taken');
        }
        if(req.user.Role.FeatureACLs[0].fields['service_fee']){
            attributes.push('service_fee');
        }
        if(req.user.Role.FeatureACLs[0].fields['interest_rate']){
            attributes.push('interest_rate');
        }
        if(req.user.Role.FeatureACLs[0].fields['duration_of_loan']){
            attributes.push('duration_of_loan');
        }
        if(req.user.Role.FeatureACLs[0].fields['status']){
            attributes.push('status');
        }
        if(req.user.Role.FeatureACLs[0].fields['amount_pending']){
            attributes.push('amount_pending');
        }
        if(req.user.Role.FeatureACLs[0].fields['bank_credit_transaction']){
            attributes.push('bank_credit_transaction');
        }
        if(req.user.Role.FeatureACLs[0].fields['bank_credit_status']){
            attributes.push('bank_credit_status');
        }
        if(req.user.Role.FeatureACLs[0].fields['currency']){
            attributes.push('currency');
        }
	attributes.push('created_at');
    }
}
db.Loan.findOne({attributes:attributes, where: {
    id: req.params['id']
},
    include:include})
    .then((loan) => {
    res.send(loan)
})
.catch(err => next(err));
});

router.put('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {date_taken, ammount_taken, service_fee, interest_rate, duration_of_loan, status, amount_pending,
        bank_credit_transaction, bank_credit_status, currency, user_id, user_payment_method_id} = req.body;

db.Loan.findOne({where: {id: req.params['id']}})
    .then((loan) => {
    if(!loan) return next(new Errors.Validation("loan is not existed"));

if(req.user.Role.FeatureACLs[0].fields['date_taken'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.date_taken = date_taken;
}
if(req.user.Role.FeatureACLs[0].fields['ammount_taken'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.ammount_taken = ammount_taken;
}
if(req.user.Role.FeatureACLs[0].fields['service_fee'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.service_fee = service_fee;
}
if(req.user.Role.FeatureACLs[0].fields['interest_rate'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.interest_rate = interest_rate;
}
if(req.user.Role.FeatureACLs[0].fields['duration_of_loan'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.duration_of_loan = duration_of_loan;
}
if(req.user.Role.FeatureACLs[0].fields['status'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.status = status;
}
if(req.user.Role.FeatureACLs[0].fields['amount_pending'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.amount_pending = amount_pending;
}
if(req.user.Role.FeatureACLs[0].fields['bank_credit_transaction'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.bank_credit_transaction = bank_credit_transaction;
}
if(req.user.Role.FeatureACLs[0].fields['bank_credit_status'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.bank_credit_status = bank_credit_status;
}
if(req.user.Role.FeatureACLs[0].fields['currency'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.currency = currency;
}
if(req.user.Role.FeatureACLs[0].fields['user_id'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.user_id = user_id;
}
if(req.user.Role.FeatureACLs[0].fields['user_payment_method_id'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    loan.user_payment_method_id = user_payment_method_id;
}

loan.save()
    .then(loan => res.send(loan));
})
.catch(err => next(err));
});

router.put('/issue-money/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.Loan.findOne({
        where: {id: req.params['id']},
        include:[{
            model:db.User
        }]
    })
    .then((loan) => {
    if(!loan) return next(new Errors.Validation("loan is not existed"));
    if(!loan.User)return next(new Errors.Validation("loan's user is not existed"));
    sequelize.sequelize.query('Select sum(amount_available) as sum from CountryInvestments where status =\'Active\' and country_id='+loan.User.country_id+' ;',
        {model: db.CountryInvestment}).then((result)=>{
        var sum = JSON.parse(JSON.stringify(result))
            if(sum[0].sum > loan.ammount_taken){
                sequelize.sequelize.query('Update CountryInvestments set status = \'Disabled\' where status =\'Active\' and country_id='+loan.User.country_id+';').then((updated)=>{
                    var countryInvestment = {
                        amount_available: parseInt(sum[0].sum) - parseInt(loan.ammount_taken),
                        country_id: loan.User.country_id,
                        loan_id: loan.id,
                        status: 'Active'
                    }
                    db.CountryInvestment.create(countryInvestment).then((countryInvestmentObj)=>{
                        var loanHistory = {
                            bank_id: '',
                            date_taken: loan.date_taken,
                            ammount_taken: loan.ammount_taken,
                            service_fee: loan.service_fee,
                            interest_rate: loan.interest_rate,
                            duration_of_loan: loan.duration_of_loan,
                            status: loan.status,
                            date: loan.created_at,
                            amount_pending: loan.amount_pending,
                            bank_credit_transaction: loan.bank_credit_transaction,
                            bank_credit_status: loan.bank_credit_status,
                            currency: loan.currency,
                            user_id: loan.user_id,
                            loan_id: loan.id,
                            admin_user_id: req.user.id
                        }
                        db.LoansHistory.create(loanHistory).then((loanHistoryObj)=>{
                         loan.status = 'Active';
                         loan.admin_user_id = req.user.id;
                            loan.save()
                            .then(loanSaved => {
                                var adminCollectDistributes ={
                                    transactionType: 'Issue Money',
                                    amount: loan.ammount_taken,
                                    loan_id: loan.id,
                                    admin_user_id: req.user.id
                                }
                                db.AdminCollectDistribute.create(adminCollectDistributes)
                                .then(()=>res.send(loanSaved))
                            });                      
                })
            })
        }).catch(err => next(err));
    } else {
        return next(new Errors.Validation("You cannot issue loan becuase User's country investment amount less than loan amount"));
    }
    })
})
});

router.delete('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.Loan.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});


module.exports = router;
