'use strict'
const db = require('../models');
const geoip = require('geoip-lite');
const randomstring = require('randomstring');
const helper = require('../helper');
const auth = require('../helper/auth');
const Errors = require('../errors');
const middlewares = require('../middlewares');
const router = require('express').Router();
const dictionary = require('../dictionary.json');
const Sequelize = require('sequelize');
const _ = require('lodash');

const Op = Sequelize.Op;

router.get('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);
    const {country_id}= req.headers;
    var include = [];
    var attributes = [];
 //   if(filter_1.where && filter_1.where.country_id){
        include.push({
            model: db.Country,
   //         where: {id: country_id*1}
        });
    //}
    if((_.isEmpty(filter_1.where) ||
            (_.keys(filter_1.where) && _.keys(filter_1.where).length ===1 && _.keys(filter_1.where)[0] === 'country_id')) &&
        req.user.role_id !== 1) {
        res.send([])
    } else {
        if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields){
            if((req.user.Role.FeatureACLs[0].fields['LOAN'] || req.user.Role.FeatureACLs[0].fields['ALL'])){
                include.push({
                    model: db.Loan,
                    include:[
                        {
                            model: db.Collection,
as: 'Collection'
                        }
                    ]
                })
            }
            if(req.user.Role.FeatureACLs[0].fields['ALL']){
                attributes = ['id', 'fname', 'mname', 'lname','email','user_location','access_token','phone_number','verified','accept','no_of_active_loans','status','sex','profilepic','relationship',
                    'available_amount','min_availalble_amount','number_of_attempts','last_attempts_time','umbrella_score','fbId','smscode','uScore_status','id_proof_file',
                    'selfie_proof_file','address_proof_file','id_verification_status','address_verification_status', 'country_id', 'created_at', 'updated_at', 'dob', 'selfie_proof_video'];
            } else {
                if (req.user.Role.FeatureACLs[0].fields['id']) {
                    attributes.push('id');
                }
                if(req.user.Role.FeatureACLs[0].fields['fname']){
                    attributes.push('fname')
                }
                if(req.user.Role.FeatureACLs[0].fields['mname']){
                    attributes.push('mname')
                }
                if(req.user.Role.FeatureACLs[0].fields['lname']){
                    attributes.push('lname')
                }
                if(req.user.Role.FeatureACLs[0].fields['email']){
                    attributes.push('email')
                }
                if(req.user.Role.FeatureACLs[0].fields['user_location']){
                    attributes.push('user_location')
                }
                if(req.user.Role.FeatureACLs[0].fields['access_token']){
                    attributes.push('access_token')
                }
                if(req.user.Role.FeatureACLs[0].fields['phone_number']){
                    attributes.push('phone_number')
                }
                if(req.user.Role.FeatureACLs[0].fields['verified']){
                    attributes.push('verified')
                }
                if(req.user.Role.FeatureACLs[0].fields['accept']){
                    attributes.push('accept')
                }
                if(req.user.Role.FeatureACLs[0].fields['no_of_active_loans']){
                    attributes.push('no_of_active_loans')
                }
                if(req.user.Role.FeatureACLs[0].fields['status']){
                    attributes.push('status')
                }
                if(req.user.Role.FeatureACLs[0].fields['sex']){
                    attributes.push('sex')
                }
                if(req.user.Role.FeatureACLs[0].fields['profilepic']){
                    attributes.push('profilepic')
                }
                if(req.user.Role.FeatureACLs[0].fields['relationship']){
                    attributes.push('relationship')
                }
                if(req.user.Role.FeatureACLs[0].fields['available_amount']){
                    attributes.push('available_amount')
                }
                if(req.user.Role.FeatureACLs[0].fields['min_availalble_amount']){
                    attributes.push('min_availalble_amount')
                }
                if(req.user.Role.FeatureACLs[0].fields['number_of_attempts']){
                    attributes.push('number_of_attempts')
                }
                if(req.user.Role.FeatureACLs[0].fields['last_attempts_time']){
                    attributes.push('last_attempts_time')
                }
                if(req.user.Role.FeatureACLs[0].fields['umbrella_score']){
                    attributes.push('umbrella_score')
                }
                if(req.user.Role.FeatureACLs[0].fields['fbId']){
                    attributes.push('fbId')
                }
                if(req.user.Role.FeatureACLs[0].fields['smscode']){
                    attributes.push('smscode')
                }
                if(req.user.Role.FeatureACLs[0].fields['uScore_status']){
                    attributes.push('uScore_status')
                }
                if(req.user.Role.FeatureACLs[0].fields['id_proof_file']){
                    attributes.push('id_proof_file')
                }
                if(req.user.Role.FeatureACLs[0].fields['selfie_proof_file']){
                    attributes.push('selfie_proof_file')
                }
                if(req.user.Role.FeatureACLs[0].fields['address_proof_file']){
                    attributes.push('address_proof_file')
                }
                if(req.user.Role.FeatureACLs[0].fields['selfie_proof_video']){
                    attributes.push('selfie_proof_video')
                }
                if(req.user.Role.FeatureACLs[0].fields['id_verification_status']){
                    attributes.push('id_verification_status')
                }
                if(req.user.Role.FeatureACLs[0].fields['address_verification_status']){
                    attributes.push('address_verification_status')
                }
                if(req.user.Role.FeatureACLs[0].fields['country_id']){
                    attributes.push('country_id')
                }
                if(req.user.Role.FeatureACLs[0].fields['created_at']){
                    attributes.push('created_at')
                }
                if(req.user.Role.FeatureACLs[0].fields['updated_at']){
                    attributes.push('updated_at')
                }
                if(req.user.Role.FeatureACLs[0].fields['dob']){
                    attributes.push('dob')
                }
            }
        }
        db.User.findAll({attributes: attributes,
            offset: filter_1.offset,
            limit: filter_1.limit,
            where: filter_1.where,
include: include

        })
            .then((users) => {
                res.send(users)
            })
            .catch(err => next(err));
    }

});
router.get('/count', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {filter}=req.query;
    const filter_1 = JSON.parse(filter);
    if(_.isEmpty(filter_1.where)&& req.user.role_id !== 1) {
        res.send({count: 0})
    } else {
    db.User.findAll({where: filter_1.where})
        .then((users) => {
            res.send({count: users.length})
        })
        .catch(err => next(err));
    }
});

router.get('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, middlewares.checkAdminUserAccess, (req, res, next) => {
    const {country_id}= req.headers;
var include = [];
var attributes = [];
if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields){
    if((req.user.Role.FeatureACLs[0].fields['country_id'] || req.user.Role.FeatureACLs[0].fields['ALL'])){
    include.push({
        model: db.Country,
        //where: {id: country_id*1}
    });
}}
if(req.user.Role.FeatureACLs[0]&&req.user.Role.FeatureACLs[0].fields){
    if((req.user.Role.FeatureACLs[0].fields['LOAN'] || req.user.Role.FeatureACLs[0].fields['ALL'])){
        include.push({
            model: db.Loan,
            include:[
                {
                    model: db.Collection,
as: 'Collection'
                }
            ]
        })
    }

    if(req.user.Role.FeatureACLs[0].fields['ALL']){
        attributes = ['id', 'fname', 'mname', 'lname','email','user_location','access_token','phone_number','verified','accept','no_of_active_loans','status','sex','profilepic','relationship',
            'available_amount','min_availalble_amount','number_of_attempts','last_attempts_time','umbrella_score','fbId','smscode','uScore_status','id_proof_file',
            'selfie_proof_file','address_proof_file','id_verification_status','address_verification_status', 'country_id', 'created_at', 'updated_at', 'dob', 'selfie_proof_video'];
    } else {
        if (req.user.Role.FeatureACLs[0].fields['id']) {
            attributes.push('id');
        }
        if(req.user.Role.FeatureACLs[0].fields['fname']){
            attributes.push('fname')
        }
        if(req.user.Role.FeatureACLs[0].fields['mname']){
            attributes.push('mname')
        }
        if(req.user.Role.FeatureACLs[0].fields['lname']){
            attributes.push('lname')
        }
        if(req.user.Role.FeatureACLs[0].fields['email']){
            attributes.push('email')
        }
        if(req.user.Role.FeatureACLs[0].fields['user_location']){
            attributes.push('user_location')
        }
        if(req.user.Role.FeatureACLs[0].fields['access_token']){
            attributes.push('access_token')
        }
        if(req.user.Role.FeatureACLs[0].fields['phone_number']){
            attributes.push('phone_number')
        }
        if(req.user.Role.FeatureACLs[0].fields['verified']){
            attributes.push('verified')
        }
        if(req.user.Role.FeatureACLs[0].fields['accept']){
            attributes.push('accept')
        }
        if(req.user.Role.FeatureACLs[0].fields['no_of_active_loans']){
            attributes.push('no_of_active_loans')
        }
        if(req.user.Role.FeatureACLs[0].fields['status']){
            attributes.push('status')
        }
        if(req.user.Role.FeatureACLs[0].fields['sex']){
            attributes.push('sex')
        }
        if(req.user.Role.FeatureACLs[0].fields['profilepic']){
            attributes.push('profilepic')
        }
        if(req.user.Role.FeatureACLs[0].fields['relationship']){
            attributes.push('relationship')
        }
        if(req.user.Role.FeatureACLs[0].fields['available_amount']){
            attributes.push('available_amount')
        }
        if(req.user.Role.FeatureACLs[0].fields['min_availalble_amount']){
            attributes.push('min_availalble_amount')
        }
        if(req.user.Role.FeatureACLs[0].fields['number_of_attempts']){
            attributes.push('number_of_attempts')
        }
        if(req.user.Role.FeatureACLs[0].fields['last_attempts_time']){
            attributes.push('last_attempts_time')
        }
        if(req.user.Role.FeatureACLs[0].fields['umbrella_score']){
            attributes.push('umbrella_score')
        }
        if(req.user.Role.FeatureACLs[0].fields['fbId']){
            attributes.push('fbId')
        }
        if(req.user.Role.FeatureACLs[0].fields['smscode']){
            attributes.push('smscode')
        }
        if(req.user.Role.FeatureACLs[0].fields['uScore_status']){
            attributes.push('uScore_status')
        }
        if(req.user.Role.FeatureACLs[0].fields['id_proof_file']){
            attributes.push('id_proof_file')
        }
        if(req.user.Role.FeatureACLs[0].fields['selfie_proof_file']){
            attributes.push('selfie_proof_file')
        }
        if(req.user.Role.FeatureACLs[0].fields['address_proof_file']){
            attributes.push('address_proof_file')
        }
        if(req.user.Role.FeatureACLs[0].fields['selfie_proof_video']){
            attributes.push('selfie_proof_video')
        }
        if(req.user.Role.FeatureACLs[0].fields['id_verification_status']){
            attributes.push('id_verification_status')
        }
        if(req.user.Role.FeatureACLs[0].fields['address_verification_status']){
            attributes.push('address_verification_status')
        }
        if(req.user.Role.FeatureACLs[0].fields['country_id']){
            attributes.push('country_id')
        }
                if(req.user.Role.FeatureACLs[0].fields['created_at']){
                    attributes.push('created_at')
                }
                if(req.user.Role.FeatureACLs[0].fields['updated_at']){
                    attributes.push('updated_at')
                }
                if(req.user.Role.FeatureACLs[0].fields['dob']){
                    attributes.push('dob')
                }
    }
}
db.User.findOne({
    attributes:attributes,
    where: {
    id: req.params['id']
},
    include:include
})
    .then((user) => {
    res.send(user)
})
.catch(err => next(err));
});

router.post('/', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {fname, mname, lname, email, dob, user_location, access_token,
        phone_number, verified, accept, no_of_active_loans, status, sex, profilepic, relationship, available_amount, min_availalble_amount, number_of_attempts,
        last_attempts_time, umbrella_score, fbId, smscode, uScore_status, id_proof_file, selfie_proof_file, address_proof_file, id_verification_status, address_verification_status, country_id, selfie_proof_video} = req.body;

let query = {
    fname: fname,
    mname: mname,
    lname: lname,
    email: email,
    dob: dob,
    user_location: user_location,
    access_token: access_token,
    phone_number: phone_number,
    verified: verified,
    accept: accept,
    no_of_active_loans: no_of_active_loans,
    status: status,
    sex: sex,
    profilepic: profilepic,
    relationship: relationship,
    available_amount: available_amount,
    min_availalble_amount: min_availalble_amount,
    number_of_attempts: number_of_attempts,
    last_attempts_time: last_attempts_time,
    umbrella_score: umbrella_score,
    fbId: fbId,
    smscode: smscode,
    uScore_status: uScore_status,
    id_proof_file: id_proof_file,
    selfie_proof_file: selfie_proof_file,
    address_proof_file:address_proof_file,
	selfie_proof_video:selfie_proof_video,
    id_verification_status: id_verification_status,
    address_verification_status: address_verification_status,
    country_id: country_id
};

db.User.create(query)
    .then(user => {
    res.send(user);
})
.catch(err => res.send({err: err.message}))
})

router.put('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {fname, mname, lname, email, dob, user_location, access_token,
        phone_number, verified, accept, no_of_active_loans, status, sex, profilepic, relationship, available_amount, min_availalble_amount, number_of_attempts,
        last_attempts_time, umbrella_score, fbId, smscode, uScore_status, id_proof_file, selfie_proof_file, address_proof_file, id_verification_status,
        address_verification_status, loan_id, country_id} = req.body;

db.User.findOne({where: {id: req.params['id']}})
    .then((user) => {
    if(!user) return next(new Errors.Validation("user is not existed"));
        console.log("///////////////////////////////////////////", req.user.Role.FeatureACLs[0])

if(req.user.Role.FeatureACLs[0].fields['fname'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.fname= fname;
}
if(req.user.Role.FeatureACLs[0].fields['mname'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.mname= mname;
}
if(req.user.Role.FeatureACLs[0].fields['lname'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.lname= lname;
}
if(req.user.Role.FeatureACLs[0].fields['email'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.email= email;
}
if(req.user.Role.FeatureACLs[0].fields['dob'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.dob= dob;
}
if(req.user.Role.FeatureACLs[0].fields['user_location'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.user_location= user_location;
}
if(req.user.Role.FeatureACLs[0].fields['access_token'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.access_token= access_token;
}
if(req.user.Role.FeatureACLs[0].fields['phone_number'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.phone_number= phone_number;
}
if(req.user.Role.FeatureACLs[0].fields['verified'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.verified= verified;
}
if(req.user.Role.FeatureACLs[0].fields['accept'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.accept= accept;
}
if(req.user.Role.FeatureACLs[0].fields['no_of_active_loans'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.no_of_active_loans= no_of_active_loans;
}
if(req.user.Role.FeatureACLs[0].fields['status'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.status=status;
}
if(req.user.Role.FeatureACLs[0].fields['sex'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.sex= sex;
}
if(req.user.Role.FeatureACLs[0].fields['profilepic'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.profilepic= profilepic;
}
if(req.user.Role.FeatureACLs[0].fields['relationship'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.relationship= relationship;
}
if(req.user.Role.FeatureACLs[0].fields['available_amount'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.available_amount= available_amount;
}
if(req.user.Role.FeatureACLs[0].fields['min_availalble_amount'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.min_availalble_amount= min_availalble_amount;
}
if(req.user.Role.FeatureACLs[0].fields['number_of_attempts'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.number_of_attempts= number_of_attempts;
}
if(req.user.Role.FeatureACLs[0].fields['last_attempts_time'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.last_attempts_time= last_attempts_time;
}
if(req.user.Role.FeatureACLs[0].fields['umbrella_score'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.umbrella_score= umbrella_score;
}
if(req.user.Role.FeatureACLs[0].fields['fbId'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.fbId= fbId;
}
if(req.user.Role.FeatureACLs[0].fields['smscode'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.smscode= smscode;
}
if(req.user.Role.FeatureACLs[0].fields['uScore_status'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.uScore_status= uScore_status;
}
if(req.user.Role.FeatureACLs[0].fields['id_proof_file'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.id_proof_file= id_proof_file;
}
if(req.user.Role.FeatureACLs[0].fields['selfie_proof_file'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.selfie_proof_file= selfie_proof_file;
}
if(req.user.Role.FeatureACLs[0].fields['address_proof_file'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.address_proof_file= address_proof_file;
}
if(req.user.Role.FeatureACLs[0].fields['id_verification_status'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.id_verification_status= id_verification_status;
}
if(req.user.Role.FeatureACLs[0].fields['address_verification_status'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.address_verification_status= address_verification_status;
}

if(req.user.Role.FeatureACLs[0].fields['country_id'] || req.user.Role.FeatureACLs[0].fields['ALL']){
    user.country_id= country_id;
}

user.save()
    .then(user => res.send(user));
})
.catch(err => next(err));
});

router.put('/updateTrigerCreditScore/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    const {} = req.body;
    res.send({success: true})
});

router.delete('/:id', middlewares.validateAdminUser, middlewares.checkAdminUserURLAuth, middlewares.checkAdminUserActionAuth, (req, res, next) => {
    db.User.destroy({where: {id: req.params['id']}})
    .then(() => res.send(true))
.catch(err => next(err));
});
module.exports = router;
