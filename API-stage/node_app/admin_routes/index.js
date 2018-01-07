'use strict';
var fs = require('fs');

var config;config
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
router.use('/role', require('./role'));
router.use('/feature-acl', require('./feature_ACL'));

module.exports = router
