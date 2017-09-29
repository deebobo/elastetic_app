/**
 * Created by elastetic.dev on 16/06/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict';

var express = require('express');
var router = express.Router({mergeParams: true});
const ctrlConnections = require.main.require('../api/controllers/connections');

/* GET all template for current site.
 optional variable: plugin
 example:  connection?plugin=028289823
* */
router.get('/', ctrlConnections.get);

/* GET all template for current site. */
router.get('/:connection', ctrlConnections.getConnection);

/* add a new template. */
router.post('/', ctrlConnections.create);

/* update a template. */
router.put('/:connection', ctrlConnections.update);

/* remove a template. */
router.delete('/:connection', ctrlConnections.delete);

/*webhook callback*/
router.post('/:connection/call', ctrlConnections.call);

/*refresh token for webhook callback*/
router.post('/:connection/refreshtoken', ctrlConnections.refreshToken);

module.exports = router;
