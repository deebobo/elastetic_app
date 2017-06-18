/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

var express = require('express');
var router = express.Router({mergeParams: true});
const ctrlPlugins = require.main.require('../api/controllers/plugins');

/* GET all plugins for current site. */
router.get('/', ctrlPlugins.get);

/* GET all plugins for current site of a particulartype. */
router.get('/:type', ctrlPlugins.getForType);

/* add a new plugin. */
router.post('/', ctrlPlugins.post);

/* upgrade or change a plugin. */
router.put('/', ctrlPlugins.put);

/* uninstall a plugin. */
router.delete('/', ctrlPlugins.delete);

module.exports = router;
