/**
 * Created by Deebobo.dev on 26/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const express = require('express');
const winston = require('winston');
let router = express.Router({mergeParams: true});
const ctrlAuth = require.main.require('../api/controllers/site_authentication');


// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    winston.log("info", "site log-in attempt at", req.params.site, " by,", ip, "at", Date.now());
    next();
});

// authentication
router.post('/register', ctrlAuth.register);
router.post('/login', ctrlAuth.login);
router.get('/activate/:activationKey', ctrlAuth.activate);

module.exports = router;
