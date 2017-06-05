const express = require('express');
const winston = require('winston');
let router = express.Router({mergeParams: true});
const ctrlSites = require.main.require('../api/controllers/sites');

/* operations on sites. */
router.get('/', ctrlSites.get);
//router.get('/',function(req, res, next) {
//    res.send('respond with a resource');
//});
router.post('/', ctrlSites.create);

module.exports = router;
