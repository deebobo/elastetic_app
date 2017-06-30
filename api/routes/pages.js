const express = require('express');
var router = express.Router({mergeParams: true});
const ctrlPages = require.main.require('../api/controllers/pages');


router.get('/', ctrlPages.get);
router.get('/:page', ctrlPages.getPage);
router.post('/', ctrlPages.create);
router.put('/:page', ctrlPages.update);
router.delete('/:page', ctrlPages.delete);

module.exports = router;
