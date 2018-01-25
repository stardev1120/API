'use strict';
var fs = require('fs');

var config;
if (fs.existsSync('./config/config_prod.json')) {
    // Do something
    console.log('prod config picked3');
    config = require('../config/config_prod');
}
else if (fs.existsSync('./config/config_stage.json')) {
    // Do something
    console.log('stage config picked3');
    config = require('../config/config_stage');
}
else
{
  console.log('Dev/Local config picked3');
  config = require('../config/config');
}


const router = require('express').Router();

router.use('/admin-user', require('./admin_user'));
router.use('/company', require('./company'));
router.use('/distribution-center', require('./distribution_center'));
router.use('/adminuser-country', require('./admin_user_country'));
router.use('/admin-user-country', require('./admin_user_country'));
router.use('/role', require('./role'));
router.use('/feature-acl', require('./feature_ACL'));

router.use('/user', require('./user'));
router.use('/country', require('./country'));
router.use('/country-setting', require('./country_setting'));
router.use('/non-supported-country-lead', require('./non_supported_country_lead'));
router.use('/country-investment', require('./country_investment'));
router.use('/loan', require('./loan'));
router.use('/collection', require('./collection'));
router.use('/admin-collect-distribute', require('./admin_collect_distribute'));
router.use('/admin-user-access', require('./admin_user_access'));
module.exports = router;
