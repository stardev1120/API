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
const AWS = require('aws-sdk');
const config = require('../config/config');

router.post('/', middlewares.validateAdminUser, function(req, res, next){
    const {filename, type}=req.body;
    AWS.config.update({
        accessKeyId: config.AWS.accessKeyId,
        secretAccessKey: config.AWS.secretAccessKey,
        region: config.AWS.region
    });
    AWS.config.apiVersions = {
        s3: config.AWS.apiVersion
    };
    const s3 = new AWS.S3({
        signatureVersion: 'v4'
    });

    const myBucket = config.AWS.bucketName;
    const myKey = filename;
    const signedUrlExpireSeconds = config.AWS.defaultSignedUrlExpirationInSecs;

    var url = s3.getSignedUrl('putObject', {
        Bucket: myBucket,
        Key: myKey,
        Expires: signedUrlExpireSeconds
    });
    res.json({url: url, urlBasic: config.AWS.urlBasic})
})

module.exports = router;
