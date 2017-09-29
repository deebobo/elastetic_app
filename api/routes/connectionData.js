/**
 * Created by elastetic.dev on 16/06/2017.
 * copyright 2017 elastetic.dev
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
router.put('/:record', ctrlConData.put);

//remove connection data from this connection
router.delete('/:record', ctrlConData.deleteRec);

//get statistics about historical data stored by this connection
router.get('/timerange', ctrlConData.getTimerange);

//get data in a report form. This allows for grouping, selecting fields, calculations on fields (min, max,..), filtering
router.get('/report', ctrlConData.getReport);

module.exports = router;
