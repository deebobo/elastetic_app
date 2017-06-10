var express = require('express');
var router = express.Router({mergeParams: true});
const ctrlPlugins = require.main.require('../api/controllers/plugins');

/* GET all plugins for current site. */
router.get('/', ctrlPlugins.get);

/* add a new plugin. */
router.post('/', ctrlPlugins.post);

/* upgrade or change a plugin. */
router.put('/', ctrlPlugins.put);

/* uninstall a plugin. */
router.delete('/', ctrlPlugins.delete);

module.exports = router;
