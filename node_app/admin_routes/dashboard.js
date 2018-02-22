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

router.post('/all', middlewares.validateAdminUser, (req, res, next) => {
    const {country_id, start_date, end_date} = req.body;
    if(req.user.role_id !== 1) next(new Errors.Forbidden("You are not super admin to see all charts"));

    runAllDashboardCharts(country_id, start_date, end_date).then((results)=>{
        res.json(results);
        next();
    }).catch((error)=> next(error));;
});

var runAllDashboardCharts= function(country_id, start_date, end_date){
    var promises = [];
    var results={};
    //users-per-date
    promises.push(users_per_date(country_id, start_date, end_date)); //['users-per-date'] =
    promises.push(users_per_date_count(country_id, start_date, end_date)); //['users-per-date-count'] =
    //collected-amount-per-date
    promises.push(collected_amount_per_date(country_id, start_date, end_date));
    promises.push(collected_amount_per_date_sum(country_id, start_date, end_date));
    //loans-per-date
    promises.push(loans_per_date(country_id, start_date, end_date))
    promises.push(loans_per_date_count(country_id, start_date, end_date))
    //avg-uscore-per-date
    promises.push(avg_uscore_per_date(country_id, start_date, end_date));
    promises.push(avg_uscore_per_date_avg(country_id, start_date, end_date));
    //collections-per-date
    promises.push(collections_per_date(country_id, start_date, end_date));
    promises.push(collections_per_date_count(country_id, start_date, end_date));
    //otp-user-per-date
    promises.push(otp_user_per_date(country_id, start_date, end_date));
    promises.push(otp_user_per_date_count(country_id, start_date, end_date));
    //issued-amount-per-date
    promises.push(issued_amount_per_date(country_id, start_date, end_date))
    promises.push(issued_amount_per_date_sum(country_id, start_date, end_date))
    //unverified-users-per-date
    promises.push(unverified_users_per_date(country_id, start_date, end_date))
    promises.push(unverified_users_per_date_count(country_id, start_date, end_date))
    //left-money-per-date
    promises.push(left_money_per_date(country_id, start_date, end_date))
    promises.push(left_money_per_date_sum(country_id, start_date, end_date))
    //collection-count-per-date-with-status
    promises.push(collection_count_per_date_with_status(country_id, start_date, end_date));
    promises.push(collection_count_per_date_with_status_count(country_id, start_date, end_date));
    //users-loans-collections-per-date
    promises.push(getUsersCountPerMonth(country_id, start_date, end_date));
    promises.push(getLoansCountPerMonth(country_id, start_date, end_date));
    promises.push(getCollectionsCountPerMonth(country_id, start_date, end_date));
    //users-loans-collections-amount-per-date
    promises.push(getUsersCountPerMonth(country_id, start_date, end_date));
    promises.push(getLoansAmountPerMonth(country_id, start_date, end_date));
    promises.push(getCollectionsAmountPerMonth(country_id, start_date, end_date));
    //revenue-per-date
    promises.push(revenue_per_date(country_id, start_date, end_date));
    promises.push(revenue_per_date_sum(country_id, start_date, end_date));
   return Promise.all(promises).then((result)=>{

        var countObj = JSON.parse(JSON.stringify(result));
    //users-per-date
    var resultArr1 = _.map(result[0], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key];
    });
    var resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value];
    });
    var resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['users-per-date'] = {data: resultArr3, count: countObj[1][0].count};

    //collected-amount-per-date
    resultArr1 = _.map(result[2], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[2], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collected-amount-per-date'] = {data: resultArr3, sum: countObj[3][0].sum};

    //loans-per-date
    resultArr1 = _.map(result[4], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[4], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['loans-per-date'] = {data: resultArr3, count: countObj[5][0].count};
    //avg-uscore-per-date
    resultArr1 = _.map(result[6], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    })
    resultArr2 = _.map(result[6], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['avg-uscore-per-date'] = {data: resultArr3, avg: countObj[7][0].avg};
    //collections-per-date
    resultArr1 = _.map(result[8], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    })
    resultArr2 = _.map(result[8], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    })
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collections-per-date'] = {data: resultArr3, count: countObj[9][0].count};
    //otp-user-per-date
    resultArr1 = _.map(countObj[10], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(n))));
        return nObj[key]
    });
    resultArr2 = _.map(countObj[10], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['otp-user-per-date'] = {data: resultArr3, count: countObj[11][0].count};
    //issued-amount-per-date
    resultArr1 = _.map(result[12], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[12], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    })
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['issued-amount-per-date'] = {data: resultArr3, sum: countObj[13][0].sum};
    //unverified-users-per-date
    resultArr1 = _.map(result[14], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    })
    resultArr2 = _.map(result[14], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['unverified-users-per-date'] = {data: resultArr3, count: countObj[15][0].count};
    //left-money-per-date
    resultArr1 = _.map(result[16], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[16], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['left-money-per-date'] = {data: resultArr3, sum: countObj[17][0].sum};
    //collection-count-per-date-with-status
    resultArr1 = _.map(result[18], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[18], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collection-count-per-date-with-status'] = {data: resultArr3, count: countObj[19][0].count};
    // users-loans-collections-per-date
    var arrayFlat = _.uniq(_.flatten([countObj[20], countObj[21], countObj[22]]));
    var arrayResult = [];
    _.each(arrayFlat, function (i) {
        var item = _.cloneDeep(i);

        if (arrayResult.length === 0) {
            arrayResult.push(item)
        } else {
            var itemObj = _.filter(arrayResult, function (obj) {
                return obj['key'] === item['key']
            });
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
    results['users-loans-collections-per-date'] = {data: arrayResult};
    //users-loans-collections-amount-per-date
    arrayFlat = _.uniq(_.flatten([countObj[23], countObj[24], countObj[25]]));
    arrayResult = [];
    _.each(arrayFlat, function (i) {
        var item = _.cloneDeep(i);
        if (arrayResult.length === 0) {
            arrayResult.push(item)
        } else {
            var itemObj = _.filter(arrayResult, function (obj) {
                return obj['key'] === item['key']
            });
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
    results['users-loans-collections-amount-per-date'] = {data: arrayResult};
    //revenue-per-date
    resultArr1 = _.map(result[26], function (n) {
        var subArray = [];
        var key = 'key';
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        subArray.push(nObj[key]);
        subArray.push(nObj[value]);
        return subArray
    });
    results['revenue-per-date'] = {data: resultArr1, sum: countObj[27][0].sum};
    return results
})
}

router.post('/', middlewares.validateAdminUser, (req, res, next) => {
    const {country_id, start_date, end_date} = req.body;
    if(req.user.role_id === 1) {
        return runSuperAdminDashboardCharts(country_id, start_date, end_date).then((results)=>{
            res.json(results);
            next();
        }).catch((error)=> next(error));
    } else if(req.user.role_id === 2) {
        return runAdminDashboardCharts(country_id, start_date, end_date).then((results)=>{
            res.json(results);
            next();
        }).catch((error)=> next(error));
    }else if(req.user.role_id === 3) {
        return runCallCenterDashboardCharts(country_id, start_date, end_date, req.user.id).then((results)=>{
            res.json(results);
            next();
        }).catch((error)=> next(error));
    }else if(req.user.role_id === 4) {
        return runDistributorAdminDashboardCharts(country_id, start_date, end_date, req.user).then((results)=>{
            res.json(results);
            next();
        }).catch((error)=> next(error));
    }else if(req.user.role_id === 5) {
        return runDistributorDashboardCharts(country_id, start_date, end_date, req.user.id).then((results)=>{
            res.json(results);
            next();
        }).catch((error)=> next(error));
    } else {
        return next(new Errors.Forbidden("You are not admin to see any chart."));
    }
});

var runSuperAdminDashboardCharts = function(country_id, start_date, end_date){
    var promises = [];
    var results={};
    //users-per-date
    promises.push(users_per_date(country_id, start_date, end_date));
    promises.push(users_per_date_count(country_id, start_date, end_date));
    //loans-per-date
    promises.push(loans_per_date(country_id, start_date, end_date));
    promises.push(loans_per_date_count(country_id, start_date, end_date));
    //collections-per-date
    promises.push(collections_per_date(country_id, start_date, end_date));
    promises.push(collections_per_date_count(country_id, start_date, end_date));
    //issued-amount-per-date
    promises.push(issued_amount_per_date(country_id, start_date, end_date));
    promises.push(issued_amount_per_date_sum(country_id, start_date, end_date));
    //collected-amount-per-date
    promises.push(collected_amount_per_date(country_id, start_date, end_date));
    promises.push(collected_amount_per_date_sum(country_id, start_date, end_date));
    //avg-uscore-per-date
    promises.push(avg_uscore_per_date(country_id, start_date, end_date));
    promises.push(avg_uscore_per_date_avg(country_id, start_date, end_date));
    //otp-user-per-date
    promises.push(otp_user_per_date(country_id, start_date, end_date));
    promises.push(otp_user_per_date_count(country_id, start_date, end_date));
    //unverified-users-per-date
    promises.push(unverified_users_per_date(country_id, start_date, end_date));
    promises.push(unverified_users_per_date_count(country_id, start_date, end_date))
    //left-money-per-date
    promises.push(left_money_per_date(country_id, start_date, end_date));
    promises.push(left_money_per_date_sum(country_id, start_date, end_date));
    //collection-count-per-date-with-status
    promises.push(collection_count_per_date_with_status(country_id, start_date, end_date));
    promises.push(collection_count_per_date_with_status_count(country_id, start_date, end_date));
    //users-loans-collections-per-date
    promises.push(getUsersCountPerMonth(country_id, start_date, end_date)); 
    promises.push(getLoansCountPerMonth(country_id, start_date, end_date));
    promises.push(getCollectionsCountPerMonth(country_id, start_date, end_date));
    //users-loans-collections-amount-per-date
    promises.push(getUsersCountPerMonth(country_id, start_date, end_date));
    promises.push(getLoansAmountPerMonth(country_id, start_date, end_date));
    promises.push(getCollectionsAmountPerMonth(country_id, start_date, end_date));
    //revenue-per-date
    promises.push(revenue_per_date(country_id, start_date, end_date)); 
    promises.push(revenue_per_date_sum(country_id, start_date, end_date));

    return Promise.all(promises).then((result)=>{
        var countObj = JSON.parse(JSON.stringify(result));
    //users-per-date
    var resultArr1 = _.map(result[0], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key];
    });
    var resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value];
    });
    var resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['users-per-date'] = {data: resultArr3, count: countObj[1][0].count};
//loans-per-date
    resultArr1 = _.map(result[2], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[2], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['loans-per-date'] = {data: resultArr3, count: countObj[3][0].count};
    //collections-per-date
    resultArr1 = _.map(result[4], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    })
    resultArr2 = _.map(result[4], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    })
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collections-per-date'] = {data: resultArr3, count: countObj[5][0].count};
//issued-amount-per-date
    resultArr1 = _.map(result[6], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[6], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    })
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['issued-amount-per-date'] = {data: resultArr3, sum: countObj[7][0].sum};
    //collected-amount-per-date
    resultArr1 = _.map(result[8], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[8], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collected-amount-per-date'] = {data: resultArr3, sum: countObj[9][0].sum};
    //avg-uscore-per-date
    resultArr1 = _.map(result[10], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    })
    resultArr2 = _.map(result[10], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['avg-uscore-per-date'] = {data: resultArr3, avg: countObj[11][0].avg};
    //otp-user-per-date
    resultArr1 = _.map(countObj[12], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(n))));
        return nObj[key]
    });
    resultArr2 = _.map(countObj[12], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['otp-user-per-date'] = {data: resultArr3, count: countObj[13][0].count};
    //unverified-users-per-date
    resultArr1 = _.map(result[14], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    })
    resultArr2 = _.map(result[14], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['unverified-users-per-date'] = {data: resultArr3, count: countObj[15][0].count};
    //left-money-per-date
    resultArr1 = _.map(result[16], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[16], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['left-money-per-date'] = {data: resultArr3, sum: countObj[17][0].sum};
    //collection-count-per-date-with-status
    resultArr1 = _.map(result[18], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[18], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collection-count-per-date-with-status'] = {data: resultArr3, count: countObj[19][0].count};
    // users-loans-collections-per-date
    var arrayFlat = _.uniq(_.flatten([countObj[20], countObj[21], countObj[22]]));
    var arrayResult = [];
    _.each(arrayFlat, function (i) {
        var item = _.cloneDeep(i);

        if (arrayResult.length === 0) {
            arrayResult.push(item)
        } else {
            var itemObj = _.filter(arrayResult, function (obj) {
                return obj['key'] === item['key']
            });
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
    results['users-loans-collections-per-date'] = {data: arrayResult};
    //users-loans-collections-amount-per-date
    arrayFlat = _.uniq(_.flatten([countObj[23], countObj[24], countObj[25]]));
    arrayResult = [];
    _.each(arrayFlat, function (i) {
        var item = _.cloneDeep(i);
        if (arrayResult.length === 0) {
            arrayResult.push(item)
        } else {
            var itemObj = _.filter(arrayResult, function (obj) {
                return obj['key'] === item['key']
            });
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
    results['users-loans-collections-amount-per-date'] = {data: arrayResult};
    //revenue-per-date
    resultArr1 = _.map(result[26], function (n) {
        var subArray = [];
        var key = 'key';
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        subArray.push(nObj[key]);
        subArray.push(nObj[value]);
        return subArray
    });
    results['revenue-per-date'] = {data: resultArr1, sum: countObj[27][0].sum};
    return results
})
}
var runAdminDashboardCharts = function(country_id, start_date, end_date){
    var promises = [];
    var results={};
    //users-per-date
    promises.push(users_per_date(country_id, start_date, end_date)); // 0
    promises.push(users_per_date_count(country_id, start_date, end_date));// 1
    //loans-per-date
    promises.push(loans_per_date(country_id, start_date, end_date));// 2
    promises.push(loans_per_date_count(country_id, start_date, end_date)); // 3
    //collections-per-date
    promises.push(collections_per_date(country_id, start_date, end_date)); // 4
    promises.push(collections_per_date_count(country_id, start_date, end_date)); // 5
    //issued-amount-per-date
    promises.push(issued_amount_per_date(country_id, start_date, end_date)); // 6
    promises.push(issued_amount_per_date_sum(country_id, start_date, end_date)); // 7
    //collected-amount-per-date
    promises.push(collected_amount_per_date(country_id, start_date, end_date)); // 8
    promises.push(collected_amount_per_date_sum(country_id, start_date, end_date)); // 9
    //avg-uscore-per-date
    promises.push(avg_uscore_per_date(country_id, start_date, end_date)); // 10
    promises.push(avg_uscore_per_date_avg(country_id, start_date, end_date)); // 11
    //otp-user-per-date
    promises.push(otp_user_per_date(country_id, start_date, end_date)); // 12
    promises.push(otp_user_per_date_count(country_id, start_date, end_date)); // 13
    //unverified-users-per-date
    promises.push(unverified_users_per_date(country_id, start_date, end_date)); // 14
    promises.push(unverified_users_per_date_count(country_id, start_date, end_date)); // 15

    return Promise.all(promises).then((result)=>{

        var countObj = JSON.parse(JSON.stringify(result));
    //users-per-date
    var resultArr1 = _.map(result[0], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key];
    });
    var resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value];
    });
    var resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['users-per-date'] = {data: resultArr3, count: countObj[1][0].count};
//loans-per-date
    resultArr1 = _.map(result[2], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[2], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['loans-per-date'] = {data: resultArr3, count: countObj[3][0].count};
    //collections-per-date
    resultArr1 = _.map(result[4], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    })
    resultArr2 = _.map(result[4], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    })
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collections-per-date'] = {data: resultArr3, count: countObj[5][0].count};
//issued-amount-per-date
    resultArr1 = _.map(result[6], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[6], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    })
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['issued-amount-per-date'] = {data: resultArr3, sum: countObj[7][0].sum};
    //collected-amount-per-date
    resultArr1 = _.map(result[8], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[8], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collected-amount-per-date'] = {data: resultArr3, sum: countObj[9][0].sum};
    //avg-uscore-per-date
    resultArr1 = _.map(result[10], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    })
    resultArr2 = _.map(result[10], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['avg-uscore-per-date'] = {data: resultArr3, avg: countObj[11][0].avg};
    //otp-user-per-date
    resultArr1 = _.map(countObj[12], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(n))));
        return nObj[key]
    });
    resultArr2 = _.map(countObj[12], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['otp-user-per-date'] = {data: resultArr3, count: countObj[13][0].count};
    //unverified-users-per-date
    resultArr1 = _.map(result[14], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    })
    resultArr2 = _.map(result[14], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['unverified-users-per-date'] = {data: resultArr3, count: countObj[15][0].count};

    return results
})
}
var runCallCenterDashboardCharts = function(country_id, start_date, end_date, admin_user_id){
    var promises = [];
    var results={};
    //unverified-users-per-date
    promises.push(unverified_users_per_date(country_id, start_date, end_date));
    promises.push(unverified_users_per_date_count(country_id, start_date, end_date));
    //otp-user-per-date-by-current-count
    promises.push(otp_user_per_date_by_current(country_id, start_date, end_date, admin_user_id));
    promises.push(otp_user_per_date_by_current_count(country_id, start_date, end_date, admin_user_id));

    return Promise.all(promises).then((result)=>{
    var countObj = JSON.parse(JSON.stringify(result));
    //unverified-users-per-date
    resultArr1 = _.map(result[0], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    })
    resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['unverified-users-per-date'] = {data: resultArr3, count: countObj[1][0].count};
    //otp-user-per-date
    var resultArr1 = _.map(countObj[2], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(n))));
        return nObj[key]
    });
    var resultArr2 = _.map(countObj[2], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    var resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['otp-user-per-date-current'] = {data: resultArr3, count: countObj[3][0].count};

    return results
})
}
var runDistributorAdminDashboardCharts = function(country_id, start_date, end_date, adminUser){
    var promises = [];
    var results={};
    //collections-per-date-by-current
    promises.push(collections_per_date_by_current(country_id, start_date, end_date, adminUser.id));
    promises.push(collections_per_date_by_current_count(country_id, start_date, end_date, adminUser.id));
//Distributes-per-date-by-current
    promises.push(Distributes_per_date_by_current(country_id, start_date, end_date, adminUser.id));
    promises.push(Distributes_per_date_by_current_count(country_id, start_date,
        end_date, adminUser.id));
//issued-amount-per-date-by-current
    promises.push(issued_amount_per_date_by_current(country_id, start_date, end_date, adminUser.id));
    promises.push(issued_amount_per_date_by_current_sum(country_id, start_date, end_date, adminUser.id));
//collected-amount-per-date-by-current
    promises.push(collected_amount_per_date_by_current(country_id, start_date, end_date, adminUser.id));
    promises.push(collected_amount_per_date_by_current_sum(country_id, start_date, end_date, adminUser.id));
//Distributes-per-date-by-company
    promises.push(Distributes_per_date_by_company(country_id, start_date, end_date, adminUser));
    promises.push(Distributes_per_date_by_company_count(country_id, start_date, end_date, adminUser));
//collections-per-date-by-company
    promises.push(collections_per_date_by_company(country_id, start_date, end_date, adminUser));
    promises.push(collections_per_date_by_company_count(country_id, start_date, end_date, adminUser));
//issued-amount-per-date-by-company
    promises.push(issued_amount_per_date_by_company(country_id, start_date, end_date, adminUser));
    promises.push(issued_amount_per_date_by_company_sum(country_id, start_date, end_date, adminUser));
//collected-amount-per-date-by-company
    promises.push(collected_amount_per_date_by_company(country_id, start_date, end_date, adminUser));
    promises.push(collected_amount_per_date_by_company_sum(country_id, start_date, end_date, adminUser));
    return Promise.all(promises).then((result)=>{
    var countObj = JSON.parse(JSON.stringify(result));
    //collections-per-date-by-current
    var resultArr1 = _.map(result[0], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    var resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    var resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collections-per-date-by-current'] = {data: resultArr3, count: countObj[1][0].count};
    //distributes-per-date-by-current
    resultArr1 = _.map(result[2], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[2], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['distributes-per-date-by-current'] = {data: resultArr3, count: countObj[3][0].count};
    //issued-amount-per-date-by-current
    resultArr1 = _.map(result[4], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[4], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['issued-amount-per-date-by-current'] = {data: resultArr3, sum: countObj[5][0].sum};
    //collected-amount-per-date-by-current
    resultArr1 = _.map(result[6], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[6], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collected-amount-per-date-by-current'] = {data: resultArr3, sum: countObj[7][0].sum};

    //collections-per-date-by-company
    resultArr1 = _.map(result[8], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    })
    resultArr2 = _.map(result[8], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collections-per-date-by-company'] = {data: resultArr3, count: countObj[9][0].count};
    //distributes-per-date-by-company
    resultArr1 = _.map(result[10], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[10], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['distributes-per-date-by-company'] = {data: resultArr3, count: countObj[11][0].count};
    //issued-amount-per-date-by-company
    resultArr1 = _.map(result[12], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[12], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['issued-amount-per-date-by-company'] = {data: resultArr3, sum: countObj[13][0].sum};
    //collected-amount-per-date-by-company
    resultArr1 = _.map(result[14], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[14], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collected-amount-per-date-by-company'] = {data: resultArr3, sum: countObj[15][0].sum};

    return results
})
}
var runDistributorDashboardCharts = function(country_id, start_date, end_date, admin_user_id){
    var promises = [];
    var results={};
    //issued-amount-per-date
    promises.push(issued_amount_per_date(country_id, start_date, end_date));
    promises.push(issued_amount_per_date_sum(country_id, start_date, end_date));
    //collected-amount-per-date
    promises.push(collected_amount_per_date(country_id, start_date, end_date));
    promises.push(collected_amount_per_date_sum(country_id, start_date, end_date));
    //collections-per-date-by-current
    promises.push(collections_per_date_by_current(country_id, start_date, end_date, admin_user_id));
    promises.push(collections_per_date_by_current_count(country_id, start_date, end_date, admin_user_id));
    //Distributes-per-date-by-current
    promises.push(Distributes_per_date_by_current(country_id, start_date, end_date, admin_user_id));
    promises.push(Distributes_per_date_by_current_count(country_id, start_date,
        end_date, admin_user_id));

    return Promise.all(promises).then((result)=>{

        var countObj = JSON.parse(JSON.stringify(result));
    //issued-amount-per-date
    resultArr1 = _.map(result[0], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[0], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    })
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['issued-amount-per-date'] = {data: resultArr3, sum: countObj[1][0].sum};
    //collected-amount-per-date
    resultArr1 = _.map(result[2], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[2], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collected-amount-per-date'] = {data: resultArr3, sum: countObj[3][0].sum};
//collections-per-date-by-current
    var resultArr1 = _.map(result[4], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    var resultArr2 = _.map(result[4], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    var resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['collections-per-date-by-current'] = {data: resultArr3, count: countObj[5][0].count};
    //distributes-per-date-by-current
    resultArr1 = _.map(result[6], function(n){
        var key = 'key';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[key]
    });
    resultArr2 = _.map(result[6], function(n){
        var value = 'value';
        var nObj = JSON.parse(JSON.stringify(n));
        return nObj[value]
    });
    resultArr3 = [];
    resultArr3.push(resultArr1);
    resultArr3.push(resultArr2);
    results['distributes-per-date-by-current'] = {data: resultArr3, count: countObj[7][0].count};

    return results
})
}

// 1 - 2
var users_per_date = function(country_id, start_date, end_date){
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

    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as \'key\', COUNT(*) as \'value\'\n' +
        'FROM Users\n' +
        'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {model: db.User});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as \'key\', COUNT(*) as \'value\'\n' +
            'FROM Users\n' +
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
}
var users_per_date_count = function(country_id, start_date, end_date){
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

    var count = sequelize.sequelize.query('SELECT COUNT(*) as \'count\'\n' +
        'FROM Users  limit 1;', {model: db.User});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT COUNT(*) as \'count\'\n' +
            'FROM Users\n' +
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
}
// 1 - 2
var loans_per_date = function(country_id, start_date, end_date){
    
    var filter = {};
    var whereClause = 'WHERE';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += ' users.country_id= :country_id ';
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

    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as \'key\', COUNT(*) as \'value\'\n' +
        'FROM Loans\n' +
        'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {model: db.Loan});
    var count = sequelize.sequelize.query('SELECT COUNT(*) as \'count\'\n' +
        'FROM Loans;', {model: db.Loan});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(loans.created_at, \'%a %D %M\') as \'key\', COUNT(loans.id) as \'value\'\n' +
            'FROM Loans as loans\n' +
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(loans.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var loans_per_date_count = function(country_id, start_date, end_date){
    
    var filter = {};
    var whereClause = 'WHERE';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += ' users.country_id= :country_id ';
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

    var count = sequelize.sequelize.query('SELECT COUNT(*) as \'count\'\n' +
        'FROM Loans limit 1;', {model: db.Loan});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){

        count = sequelize.sequelize.query('SELECT COUNT(loans.id) as \'count\'\n' +
            'FROM Loans as loans\n' +
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }

    return count;
};
// 1 - 2
var collections_per_date = function(country_id, start_date, end_date){
    
    var filter = {};
    var whereClause = 'WHERE';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += ' users.country_id= :country_id ';
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
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as \'key\', COUNT(collections.id) as \'value\'\n' +
        'FROM Collections as collections\n' +
        'GROUP BY  DATE_FORMAT(collections.created_at, \'%a %D %M\');', {model: db.Collection});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(collections.created_at, \'%a %D %M\') as \'key\', COUNT(collections.id) as \'value\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(collections.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var collections_per_date_count = function(country_id, start_date, end_date){
    
    var filter = {};
    var whereClause = 'WHERE';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += ' users.country_id= :country_id ';
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
    var count = sequelize.sequelize.query('SELECT COUNT(*) as \'count\'\n' +
        'FROM Collections limit 1;', {model: db.Collection});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT COUNT(collections.id) as \'count\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 1 - 2 - 5
var issued_amount_per_date = function (country_id, start_date, end_date) {
    
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
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as\'key\', SUM(ammount_taken) as \'value\'\n' +
        'FROM Loans\n' +
        'where status = \'Active\'\n' +
        'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {model: db.Loan});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(loans.created_at, \'%a %D %M\') as \'key\', SUM(ammount_taken) as \'value\'\n' +
            'FROM Loans as loans\n' +
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(loans.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var issued_amount_per_date_sum = function (country_id, start_date, end_date) {
    
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

    var count = sequelize.sequelize.query('SELECT SUM(ammount_taken) as \'sum\'\n' +
        'FROM Loans \n'+
        'where status = \'Active\'\n' +
        ' limit 1;', {model: db.Loan});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT SUM(ammount_taken) as \'sum\'\n' +
            'FROM Loans as loans\n' +
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 1 - 2 - 5
var collected_amount_per_date = function(country_id, start_date, end_date){
    
    var filter = {};
    var whereClause = 'WHERE collections.status = \'Collected\'';
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
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
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(collections.created_at, \'%a %D %M\') as\'key\', SUM(amount) as \'value\'\n' +
        'FROM Collections as collections\n' +
        'where collections.status = \'Collected\'\n' +
        'GROUP BY   DATE_FORMAT(collections.created_at, \'%a %D %M\');', {model: db.Collection});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(collections.created_at, \'%a %D %M\') as \'key\', SUM(amount) as \'value\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY   DATE_FORMAT(collections.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var collected_amount_per_date_sum = function(country_id, start_date, end_date){
    
    var filter = {};
    var whereClause = 'WHERE collections.status = \'Collected\'';
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
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
    var sum = sequelize.sequelize.query('SELECT SUM(amount) as \'sum\'\n' +
        'FROM Collections as collections \n'+
        'where collections.status = \'Collected\'\n' +
        ' limit 1;', {model: db.Loan});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        sum = sequelize.sequelize.query('SELECT SUM(amount) as \'sum\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return sum;
};
// 1 - 2
var avg_uscore_per_date = function(country_id, start_date, end_date){
    
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
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as\'key\',  ROUND(AVG(umbrella_score) ) as \'value\'\n' +
        'FROM Users\n' +
        'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {model: db.User});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as \'key\',  ROUND(AVG(umbrella_score) ) as \'value\'\n' +
            'FROM Users\n' +
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }

    return query;
};
var avg_uscore_per_date_avg = function(country_id, start_date, end_date){
    
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
    var count = sequelize.sequelize.query('SELECT  ROUND(AVG(umbrella_score) ) as \'avg\'\n' +
        'FROM Users limit 1;', {model: db.User});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT  ROUND(AVG(umbrella_score) ) as \'avg\'\n' +
            'FROM Users\n' +
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 1 - 2
var otp_user_per_date = function(country_id, start_date, end_date){
    
    var filter = {};
    var whereClause = 'WHERE';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += ' users.country_id= :country_id ';
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
    var query = sequelize.sequelize.query('SELECT   DATE_FORMAT(created_at, \'%a %D %M\') as\'key\',count(distinct  user_id ) as \'value\'\n' +
        'FROM AdminUserAccesses\n' +
        'GROUP BY DATE_FORMAT(created_at, \'%a %D %M\');', {model: db.AdminUserAccesse});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(adminUserAccesses.created_at, \'%a %D %M\') as \'key\', count(distinct  user_id ) as \'value\'\n' +
            'FROM AdminUserAccesses as adminUserAccesses\n' +
            'inner join Users as users on adminUserAccesses.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(adminUserAccesses.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var otp_user_per_date_count = function(country_id, start_date, end_date){
    
    var filter = {};
    var whereClause = 'WHERE';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += ' users.country_id= :country_id ';
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
    var count = sequelize.sequelize.query('SELECT  count(distinct  user_id ) as \'count\'\n' +
        'FROM AdminUserAccesses limit 1;', {model: db.AdminUserAccesse});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT count(distinct  user_id ) as \'count\'\n' +
            'FROM AdminUserAccesses as adminUserAccesses\n' +
            'inner join Users as users on adminUserAccesses.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 1 - 2 - 3
var unverified_users_per_date = function(country_id, start_date, end_date){
    
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
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as \'key\', COUNT(*) as \'value\'\n' +
        'FROM Users\n' +
        'WHERE verified=0 \n'+
        'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {model: db.User});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as \'key\',  COUNT(*) as \'value\'\n' +
            'FROM Users\n' +
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var unverified_users_per_date_count = function(country_id, start_date, end_date){
    
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
    var count = sequelize.sequelize.query('SELECT COUNT(*) as \'count\'\n' +
        'FROM Users\n' +
        'WHERE verified=0 \n'+
        ' limit 1;', {model: db.User});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT  COUNT(*) as \'count\'\n' +
            'FROM Users\n' +
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 1
var left_money_per_date = function(country_id, start_date, end_date){
    var filter = {};
    var whereClause = 'WHERE countryInvestments.status = \'Active\'';
    var and = whereClause !== 'WHERE' ? ' and ' : ''
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' countryInvestments.country_id= :country_id ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' countryInvestments.created_at>= :start_date ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' countryInvestments.created_at <= :end_date ';
    }
    if (whereClause === 'WHERE') {
        whereClause = '';
    }
    var query = sequelize.sequelize.query('SELECT countries.name as \'key\', SUM(countryInvestments.amount_available) as \'value\'\n' +
        'FROM CountryInvestments as countryInvestments\n' +
        'inner join Countries as countries on countryInvestments.country_id = countries.id  \n'+
        whereClause+'\n' +
        'GROUP BY countries.name;', {model: db.CountryInvestment});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT countries.name as \'key\', SUM(countryInvestments.amount_available) as \'value\'\n' +
            'FROM CountryInvestments as countryInvestments\n' +
            'inner join Countries as countries on countryInvestments.country_id = countries.id  \n'+
            whereClause+'\n' +
            'GROUP BY countries.name;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var left_money_per_date_sum = function(country_id, start_date, end_date){
    var filter = {};
    var whereClause = 'WHERE countryInvestments.status = \'Active\'';
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' countryInvestments.country_id= :country_id ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' countryInvestments.created_at>= :start_date ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' countryInvestments.created_at <= :end_date ';
    }
    if (whereClause === 'WHERE') {
        whereClause = '';
    }
    var count = sequelize.sequelize.query('SELECT  SUM(countryInvestments.amount_available) as \'sum\'\n' +
        'FROM CountryInvestments as countryInvestments\n' +
        'inner join Countries as countries on countryInvestments.country_id = countries.id  \n'+
        whereClause+'\n' +
        ' limit 1;', {model: db.CountryInvestment});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT  SUM(countryInvestments.amount_available) as \'sum\'\n' +
            'FROM CountryInvestments as countryInvestments\n' +
            'inner join Countries as countries on countryInvestments.country_id = countries.id  \n'+
            whereClause+'\n'+
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 1
var collection_count_per_date_with_status= function (country_id, start_date, end_date) {
    
    var filter={};
    var whereClause = 'where collections.status = \'To-be-Collected\' and collections.date > now() ';

    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
    }
    /*and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' date>= :start_date ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' date <= :end_date ';
    }*/

    if (whereClause === 'WHERE') {
        whereClause = '';
    }
    var query = sequelize.sequelize.query('select  DATE_FORMAT(collections.date, \'%a %D %M\') as \'key\', count(collections.loan_id)  as \'value\'\n' +
        '    from Collections as collections\n' +
        whereClause +
        '    GROUP BY DATE_FORMAT(collections.date, \'%a %D %M\');', {model: db.Collection});

    if(!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('select  DATE_FORMAT(collections.date, \'%a %D %M\') as \'key\', count(collections.loan_id)  as \'value\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            '    GROUP BY DATE_FORMAT(collections.date, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var collection_count_per_date_with_status_count= function (country_id, start_date, end_date) {
    
    var filter={};
    var whereClause = 'where collections.status = \'To-be-Collected\' and collections.date > now() ';
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
    }
    /*and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' date>= :start_date ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' date <= :end_date ';
    }*/
    if (whereClause === 'WHERE') {
        whereClause = '';
    }
    var count = sequelize.sequelize.query('SELECT  COUNT(collections.loan_id) as \'count\'\n' +
        'FROM Collections as collections' +
        whereClause+
        ' limit 1;', {model: db.Collection});

    if(!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT  COUNT(collections.loan_id) as \'count\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 3
var otp_user_per_date_by_current = function(country_id, start_date, end_date, admin_user_id){

    var filter = {};
    var whereClause = 'WHERE admin_user_id=' + admin_user_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
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
    var query = sequelize.sequelize.query('SELECT DATE_FORMAT(created_at, \'%a %D %M\') as\'key\',count(distinct  user_id ) as \'value\'\n' +
        'FROM AdminUserAccesses\n' +
        whereClause + '\n' +
        'GROUP BY DATE_FORMAT(created_at, \'%a %D %M\');', {model: db.AdminUserAccesse});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(adminUserAccesses.created_at, \'%a %D %M\') as \'key\', count(distinct  user_id ) as \'value\'\n' +
            'FROM AdminUserAccesses as adminUserAccesses\n' +
            'inner join Users as users on adminUserAccesses.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(adminUserAccesses.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var otp_user_per_date_by_current_count = function(country_id, start_date, end_date, admin_user_id){

    var filter = {};
    var whereClause = 'WHERE admin_user_id=' + admin_user_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
    }
     and = whereClause !== 'WHERE' ? ' and ' : '';
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
    var count = sequelize.sequelize.query('SELECT  count(distinct  user_id ) as \'count\'\n' +
        'FROM AdminUserAccesses \n' +
        whereClause + '\n' +
        'limit 1;', {model: db.AdminUserAccesse});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT count(distinct  user_id ) as \'count\'\n' +
            'FROM AdminUserAccesses as adminUserAccesses\n' +
            'inner join Users as users on adminUserAccesses.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 5 - 4
var collections_per_date_by_current = function(country_id, start_date, end_date, admin_user_id){

    var filter = {};
    var whereClause = 'WHERE collections.admin_user_id=' + admin_user_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
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
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(collections.created_at, \'%a %D %M\') as \'key\', COUNT(collections.id) as \'value\'\n' +
        'FROM Collections as collections\n' +
        whereClause+'\n' +
        'GROUP BY    DATE_FORMAT(collections.created_at, \'%a %D %M\');', {model: db.Collection});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(collections.created_at, \'%a %D %M\') as \'key\', COUNT(collections.id) as \'value\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY    DATE_FORMAT(collections.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var collections_per_date_by_current_count = function(country_id, start_date, end_date, admin_user_id){

    var filter = {};
    var whereClause = 'WHERE collections.admin_user_id=' + admin_user_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
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
    var count = sequelize.sequelize.query('SELECT COUNT(collections.id) as \'count\'\n' +
        'FROM Collections as collections\n' +
        whereClause+'\n' +
        'limit 1;', {model: db.Collection});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT COUNT(collections.id) as \'count\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 5 - 4
var Distributes_per_date_by_current = function(country_id, start_date, end_date, admin_user_id){
    var filter = {};
    var whereClause = 'WHERE adminCollectDistribute.admin_user_id=' + admin_user_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' adminCollectDistribute.created_at >= :start_date ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' adminCollectDistribute.created_at <= :end_date ';
    }
    if (whereClause === 'WHERE') {
        whereClause = '';
    }
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(adminCollectDistribute.created_at, \'%a %D %M\') as \'key\', COUNT(adminCollectDistribute.id) as \'value\'\n' +
        'FROM AdminCollectDistributes as adminCollectDistribute\n' +
        whereClause+'\n' +
        'GROUP BY  DATE_FORMAT(adminCollectDistribute.created_at, \'%a %D %M\');', {model: db.AdminCollectDistribute});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(adminCollectDistribute.created_at, \'%a %D %M\') as \'key\', COUNT(adminCollectDistribute.id) as \'value\'\n' +
            'FROM AdminCollectDistributes as adminCollectDistribute\n' +
            'inner join AdminUsers as adminUser on adminCollectDistribute.admin_user_id = adminUser.id \n'+
            'inner join Loans as loan on adminCollectDistribute.loan_id = loan.id \n'+
            'inner join Users as user on loan.user_id = user.id \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(adminCollectDistribute.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var Distributes_per_date_by_current_count = function(country_id, start_date, end_date, admin_user_id){
    var filter = {};
    var whereClause = 'WHERE adminCollectDistribute.admin_user_id=' + admin_user_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' user.country_id= :country_id ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' adminCollectDistribute.created_at  >= :start_date ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' adminCollectDistribute.created_at <= :end_date ';
    }
    if (whereClause === 'WHERE') {
        whereClause = '';
    }
    var count = sequelize.sequelize.query('SELECT COUNT(adminCollectDistribute.id) as \'count\'\n' +
        'FROM AdminCollectDistributes as adminCollectDistribute\n' +
        whereClause+'\n' +
        ' limit 1;', {model: db.AdminCollectDistribute});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT COUNT(adminCollectDistribute.id) as \'count\'\n' +
            'FROM AdminCollectDistributes as adminCollectDistribute\n' +
            'inner join AdminUsers as adminUser on adminCollectDistribute.admin_user_id = adminUser.id \n'+
            'inner join Loans as loan on adminCollectDistribute.loan_id = loan.id \n'+
            'inner join Users as user on loan.user_id = user.id \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 4
var issued_amount_per_date_by_current = function (country_id, start_date, end_date, admin_user_id) {

    var filter = {};
    var whereClause = 'WHERE loans.status = \'Active\' and admin_user_id = '+ admin_user_id;
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
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as\'key\', SUM(ammount_taken) as \'value\'\n' +
        'FROM Loans\n' +
        whereClause+'\n' +
        'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {model: db.Loan});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(loans.created_at, \'%a %D %M\') as \'key\', SUM(loans.ammount_taken) as \'value\'\n' +
            'FROM Loans as loans\n' +
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(loans.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var issued_amount_per_date_by_current_sum = function (country_id, start_date, end_date, admin_user_id) {

    var filter = {};
    var whereClause = 'WHERE loans.status = \'Active\' and admin_user_id = '+ admin_user_id;
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

    var count = sequelize.sequelize.query('SELECT SUM(ammount_taken) as \'sum\'\n' +
        'FROM Loans \n'+
        whereClause+'\n' +
        ' limit 1;', {model: db.Loan});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT SUM(loans.ammount_taken) as \'sum\'\n' +
            'FROM Loans as loans\n' +
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 4
var collected_amount_per_date_by_current = function(country_id, start_date, end_date, admin_user_id){

    var filter = {};
    var whereClause = 'WHERE collections.status = \'Collected\' and collections.admin_user_id = '+ admin_user_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
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
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(collections.created_at, \'%a %D %M\') as\'key\', SUM(collections.amount) as \'value\'\n' +
        'FROM Collections as collections\n' +
        whereClause+'\n' +
        'GROUP BY     DATE_FORMAT(collections.created_at, \'%a %D %M\');', {model: db.Collection});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(collections.created_at, \'%a %D %M\') as \'key\', SUM(collections.amount) as \'value\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(collections.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var collected_amount_per_date_by_current_sum = function(country_id, start_date, end_date, admin_user_id){
    var filter = {};
    var whereClause = 'WHERE collections.status = \'Collected\' and collections.admin_user_id = '+ admin_user_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
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
    var sum = sequelize.sequelize.query('SELECT SUM(collections.amount) as \'sum\'\n' +
        'FROM Collections as collections \n'+
        whereClause+'\n' +
        ' limit 1;', {model: db.Loan});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        sum = sequelize.sequelize.query('SELECT SUM(amount) as \'sum\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return sum;
};
// 4
var Distributes_per_date_by_company = function(country_id, start_date, end_date, adminUser){
    var filter = {};
    var whereClause = 'WHERE company_id=' + adminUser.company_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' user.country_id= :country_id ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' adminCollectDistribute.created_at>= :start_date ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' adminCollectDistribute.created_at <= :end_date ';
    }
    if (whereClause === 'WHERE') {
        whereClause = '';
    }
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(adminCollectDistribute.created_at, \'%a %D %M\') as \'key\', COUNT(adminCollectDistribute.id) as \'value\'\n' +
        'FROM AdminCollectDistributes as adminCollectDistribute\n' +
        'inner join AdminUsers as adminUser on adminCollectDistribute.admin_user_id = adminUser.id \n'+
        whereClause+'\n' +
        'GROUP BY  DATE_FORMAT(adminCollectDistribute.created_at, \'%a %D %M\');', {model: db.AdminCollectDistribute});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(adminCollectDistribute.created_at, \'%a %D %M\') as \'key\', COUNT(adminCollectDistribute.id) as \'value\'\n' +
            'FROM AdminCollectDistributes as adminCollectDistribute\n' +
            'inner join AdminUsers as adminUser on adminCollectDistribute.admin_user_id = adminUser.id \n'+
            'inner join Loans as loan on adminCollectDistribute.loan_id = loan.id \n'+
            'inner join Users as user on loan.user_id = user.id \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(adminCollectDistribute.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var Distributes_per_date_by_company_count = function(country_id, start_date, end_date, adminUser){
    var filter = {};
    var whereClause = 'WHERE company_id=' + adminUser.company_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' user.country_id= :country_id ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (start_date) {
        filter.start_date = start_date;
        whereClause += and + ' adminCollectDistribute.created_at>= :start_date ';
    }
    and = whereClause !== 'WHERE' ? ' and ' : '';
    if (end_date) {
        filter.end_date = end_date;
        whereClause += and + ' adminCollectDistribute.created_at <= :end_date ';
    }
    if (whereClause === 'WHERE') {
        whereClause = '';
    }
    var count = sequelize.sequelize.query('SELECT COUNT(adminCollectDistribute.id) as \'count\'\n' +
        'FROM AdminCollectDistributes as adminCollectDistribute\n' +
        'inner join AdminUsers as adminUser on adminCollectDistribute.admin_user_id = adminUser.id \n'+
        whereClause+'\n' +
        ' limit 1;', {model: db.AdminCollectDistribute});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT COUNT(adminCollectDistribute.id) as \'count\'\n' +
            'FROM AdminCollectDistributes as adminCollectDistribute\n' +
            'inner join AdminUsers as adminUser on adminCollectDistribute.admin_user_id = adminUser.id \n'+
            'inner join Loans as loan on adminCollectDistribute.loan_id = loan.id \n'+
            'inner join Users as user on loan.user_id = user.id \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 4
var collections_per_date_by_company = function(country_id, start_date, end_date, adminUser){
    var filter = {};
    var whereClause = 'WHERE company_id = '+ adminUser.company_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
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
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(collections.created_at, \'%a %D %M\') as \'key\', COUNT(collections.id) as \'value\'\n' +
        'FROM Collections as collections \n' +
        'inner join AdminUsers as adminUser on collections.admin_user_id = adminUser.id \n'+
        whereClause+'\n' +
        'GROUP BY      DATE_FORMAT(collections.created_at, \'%a %D %M\');', {model: db.Collection});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(collections.created_at, \'%a %D %M\') as \'key\', COUNT(collections.id) as \'value\'\n' +
            'FROM Collections as collections\n' +
            'inner join AdminUsers as adminUser on collections.admin_user_id = adminUser.id \n'+
            'inner join Loans as loans on collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY     DATE_FORMAT(collections.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var collections_per_date_by_company_count = function(country_id, start_date, end_date, adminUser){

    var filter = {};
    var whereClause = 'WHERE company_id = '+ adminUser.company_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
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
    var count = sequelize.sequelize.query('SELECT COUNT(collections.id) as \'count\'\n' +
        'FROM Collections as collections' +
        'inner join AdminUsers as adminUser on collections.admin_user_id = adminUser.id \n'+
        ' limit 1;', {model: db.Collection});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT COUNT(collections.id) as \'count\'\n' +
            'FROM Collections as collections\n' +
            'inner join AdminUsers as adminUser on collections.admin_user_id = adminUser.id \n'+
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 4
var issued_amount_per_date_by_company = function (country_id, start_date, end_date, adminUser) {
    var filter = {};
    var whereClause = 'WHERE loans.status = \'Active\' and company_id = '+ adminUser.company_id;
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
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(loans.created_at, \'%a %D %M\') as\'key\', SUM(loans.ammount_taken) as \'value\'\n' +
        'FROM Loans as loans \n' +
        'inner join AdminUsers as adminUser on loans.admin_user_id = adminUser.id \n'+
        whereClause+'\n' +
        'GROUP BY  DATE_FORMAT(loans.created_at, \'%a %D %M\');', {model: db.Loan});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(loans.created_at, \'%a %D %M\') as \'key\', SUM(loans.ammount_taken) as \'value\'\n' +
            'FROM Loans as loans\n' +
            'inner join AdminUsers as adminUser on loans.admin_user_id = adminUser.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(loans.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var issued_amount_per_date_by_company_sum = function (country_id, start_date, end_date, adminUser) {
    var filter = {};
    var whereClause = 'WHERE loans.status = \'Active\' and company_id = '+ adminUser.company_id;
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

    var count = sequelize.sequelize.query('SELECT SUM(loans.ammount_taken) as \'sum\'\n' +
        'FROM Loans as loans \n' +
        'inner join AdminUsers as adminUser on loans.admin_user_id = adminUser.id \n'+
        whereClause+'\n' +
        ' limit 1;', {model: db.Loan});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        count = sequelize.sequelize.query('SELECT SUM(loans.ammount_taken) as \'sum\'\n' +
            'FROM Loans as loans\n' +
            'inner join AdminUsers as adminUser on loans.admin_user_id = adminUser.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return count;
};
// 4
var collected_amount_per_date_by_company = function(country_id, start_date, end_date, adminUser){

    var filter = {};
    var whereClause = 'WHERE collections.status = \'Collected\' and company_id = '+ adminUser.company_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
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
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(collections.created_at, \'%a %D %M\') as\'key\', SUM(collections.amount) as \'value\'\n' +
        'FROM Collections as collections\n' +
        'inner join AdminUsers as adminUser on collections.admin_user_id = adminUser.id \n'+
        whereClause+'\n' +
        'GROUP BY     DATE_FORMAT(collections.created_at, \'%a %D %M\');', {model: db.Collection});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(collections.created_at, \'%a %D %M\') as \'key\', SUM(collections.amount) as \'value\'\n' +
            'FROM Collections as collections\n' +
            'inner join AdminUsers as adminUser on collections.admin_user_id = adminUser.id \n'+
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY     DATE_FORMAT(collections.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var collected_amount_per_date_by_company_sum = function(country_id, start_date, end_date, adminUser){
    var filter = {};
    var whereClause = 'WHERE collections.status = \'Collected\' and company_id = '+ adminUser.company_id;
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
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
    var sum = sequelize.sequelize.query('SELECT SUM(collections.amount) as \'sum\'\n' +
        'FROM Collections as collections \n'+
        'inner join AdminUsers as adminUser on collections.admin_user_id = adminUser.id \n'+
        whereClause+'\n' +
        ' limit 1;', {model: db.Collection});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        sum = sequelize.sequelize.query('SELECT SUM(collections.amount) as \'sum\'\n' +
            'FROM Collections as collections\n' +
            'inner join AdminUsers as adminUser on collections.admin_user_id = adminUser.id \n'+
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return sum;
};
// 1
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

    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as \'key\', COUNT(*) as \'users\'\n' +
        'FROM Users\n' +
        'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {model: db.User});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as \'key\', COUNT(*) as \'users\'\n' +
            'FROM Users\n' +
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }

    return query;
};
var getLoansCountPerMonth = function(country_id, start_date, end_date) {
    var filter = {};
    var whereClause = 'WHERE';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += ' users.country_id= :country_id ';
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

    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as \'key\', COUNT(*) as \'loans\'\n' +
        'FROM Loans\n' +
        'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {model: db.Loan});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(loans.created_at, \'%a %D %M\') as \'key\', COUNT(loans.id) as \'loans\'\n' +
            'FROM Loans as loans\n' +
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(loans.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var getCollectionsCountPerMonth = function (country_id, start_date, end_date) {
    var filter = {};
    var whereClause = 'WHERE';

    if (country_id) {
        filter.country_id = country_id;
        whereClause += ' users.country_id= :country_id ';
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
    var query = sequelize.sequelize.query('SELECT DATE_FORMAT(created_at, \'%a %D %M\') as \'key\', COUNT(collections.id) as \'collections\'\n' +
        'FROM Collections as collections\n' +
        'GROUP BY  DATE_FORMAT(collections.created_at, \'%a %D %M\');', {model: db.Collection});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(collections.created_at, \'%a %D %M\') as \'key\', COUNT(collections.id) as \'collections\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(collections.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
// 1
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
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as\'key\', SUM(ammount_taken) as \'loans\'\n' +
        'FROM Loans\n' +
        'where status = \'Active\'\n' +
        'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {model: db.Loan});
    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(loans.created_at, \'%a %D %M\') as \'key\', SUM(ammount_taken) as \'loans\'\n' +
            'FROM Loans as loans\n' +
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(loans.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
var getCollectionsAmountPerMonth = function (country_id, start_date, end_date) {
    var filter = {};
    var whereClause = 'WHERE collections.status = \'Collected\'';
    var and = whereClause !== 'WHERE' ? ' and ' : '';
    if (country_id) {
        filter.country_id = country_id;
        whereClause += and + ' users.country_id= :country_id ';
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
    var query = sequelize.sequelize.query('SELECT  DATE_FORMAT(created_at, \'%a %D %M\') as\'key\', SUM(amount) as \'collections\'\n' +
        'FROM Collections\n' +
        'where status = \'Collected\'\n' +
        'GROUP BY  DATE_FORMAT(created_at, \'%a %D %M\');', {model: db.Loan});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('SELECT  DATE_FORMAT(collections.created_at, \'%a %D %M\') as \'key\', SUM(amount) as \'collections\'\n' +
            'FROM Collections as collections\n' +
            'inner join Loans as loans on  collections.loan_id = loans.id \n'+
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  DATE_FORMAT(collections.created_at, \'%a %D %M\');', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );
    }
    return query;
};
// 1
var revenue_per_date= function(country_id, start_date, end_date){
    var filter = {};
    var whereClause = 'WHERE loans.status = \'active\'\n' ;
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

    var query = sequelize.sequelize.query('select  Date(date_taken) as \'key\', sum(ROUND((((duration_of_loan/365)*interest_rate*ammount_taken)-service_fee), 2)) as \'value\'\n' +
        'from Loans\n' +
        'where status = \'active\'\n' +
        'group by Date(date_taken);', {model: db.Loan});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        query = sequelize.sequelize.query('select   Date(loans.date_taken) as \'key\', sum(ROUND((((duration_of_loan/365)*interest_rate*ammount_taken)-service_fee), 2)) as \'value\'\n' +
            'FROM Loans as loans\n' +
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            'GROUP BY  Date(loans.date_taken);', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT} );;
    }
    return query;
}
var revenue_per_date_sum= function(country_id, start_date, end_date){
    var filter = {};
    var whereClause = 'WHERE loans.status = \'active\'\n' ;
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

    var sum = sequelize.sequelize.query('select  sum(ROUND((((duration_of_loan/365)*interest_rate*ammount_taken)-service_fee), 2)) as \'sum\'\n' +
        'from Loans\n' +
        'where status = \'active\'\n' +
        ' limit 1;', {model: db.Loan});

    if(!!filter.country_id || !!filter.start_date || !!filter.end_date){
        sum = sequelize.sequelize.query('select  sum(ROUND((((duration_of_loan/365)*interest_rate*ammount_taken)-service_fee), 2)) as \'sum\'\n' +
            'FROM Loans as loans\n' +
            'inner join Users as users on loans.user_id = users.id  \n'+
            whereClause+'\n' +
            ' limit 1;', {replacements: filter, type:sequelize.sequelize.QueryTypes.SELECT});
    }
    return sum;
}
module.exports = router;

