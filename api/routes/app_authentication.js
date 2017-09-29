/**
 * Created by elastetic.dev on 26/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const express = require('express');
const winston = require('winston');
let router = express.Router({mergeParams: true});
const ctrlAuth = require.main.require('../api/controllers/app_authentication');


// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    winston.log("info", "global log-in attempt by,", ip, "at", Date.now());
    next();
});


/* GET home page. */
router.get(function(req, res, next) {
    res.render('index', { title: 'elastetic' });
});

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.post('/resetpwd', ctrlAuth.resetPwd);

module.exports = router;


