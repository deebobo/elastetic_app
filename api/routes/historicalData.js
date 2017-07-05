/**
 * Created by Deebobo.dev on 16/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

var express = require('express');
var router = express.Router({mergeParams: true});
const ctrlHistData = require.main.require('../api/controllers/historicalData');


//get historical data stored by this connection
router.get('/', ctrlHistData.get);
//store historical data on this connection
router.post('/', ctrlHistData.post);

module.exports = router;
