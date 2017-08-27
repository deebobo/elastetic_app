/**
 * Created by Deebobo.dev on 16/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

var express = require('express');
var router = express.Router({mergeParams: true});
const ctrlConData = require.main.require('../api/controllers/connectionData');


//get connection data stored by this connection
router.get('/', ctrlConData.get);
//store connection data on this connection
router.post('/', ctrlConData.post);
//store connection data on this connection
router.put('/', ctrlConData.put);

//remove connection data from this connection
router.delete('/:record', ctrlConData.deleteRec);

//get statistics about historical data stored by this connection
router.get('/timerange', ctrlConData.getTimerange);

module.exports = router;
