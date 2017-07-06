/**
 * Created by Deebobo.dev on 4/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */


var express = require('express');
var router = express.Router({mergeParams: true});
const ctrlFunctions = require.main.require('../api/controllers/functions');

//get list of instances for the specific function plugin
router.get('/', ctrlFunctions.get);
router.get('/:funcInstance', ctrlFunctions.getInstance);
//create a new instance of a function (example: New transport)
router.post('/', ctrlFunctions.create);
router.put('/:funcInstance', ctrlFunctions.update);
router.delete('/:funcInstance', ctrlFunctions.delete);
router.post('/:funcName/:funcInstance', ctrlFunctions.call);


module.exports = router;