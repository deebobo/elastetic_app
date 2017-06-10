const express = require('express');
var router = express.Router({mergeParams: true});
const ctrlPages = require.main.require('../api/controllers/pages');


router.get('/', ctrlPages.get);
router.get('/:page', ctrlPages.getPage);
router.post('/', ctrlPages.create);

module.exports = router;
