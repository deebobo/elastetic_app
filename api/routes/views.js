const express = require('express');
var router = express.Router({mergeParams: true});
const ctrlViews = require.main.require('../api/controllers/views');


router.get('/', ctrlViews.get);
router.get('/:view', ctrlViews.getPage);
router.post('/', ctrlViews.create);
router.put('/:view', ctrlViews.update);
router.delete('/:view', ctrlViews.delete);

module.exports = router;
