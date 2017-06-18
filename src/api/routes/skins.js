const express = require('express');
var router = express.Router({mergeParams: true});
const ctrlSkins = require.main.require('../api/controllers/skins');


router.get('/', ctrlSkins.get);
router.put('/', ctrlPages.set);

module.exports = router;
