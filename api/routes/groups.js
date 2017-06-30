var express = require('express');
var router = express.Router({mergeParams: true});
const ctrlGroups = require.main.require('../api/controllers/groups');

router.get('/', ctrlGroups.list);
router.get('/view', ctrlGroups.listViews);
router.get('/:group', ctrlGroups.getGrp);
router.put('/:group', ctrlGroups.updateGrp);
router.post('/', ctrlGroups.create);

module.exports = router;
