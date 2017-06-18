var express = require('express');
var router = express.Router({mergeParams: true});
const ctrlUsers = require.main.require('../api/controllers/users');


router.get('/', ctrlUsers.list);
router.get('/:user', ctrlUsers.getUser);
router.post('/', ctrlUsers.create);
router.post('/:user/group/:group', ctrlUsers.addToGrp);
router.delete('/:user/group/:group', ctrlUsers.removeFromGrp);
router.post('/invite', ctrlUsers.invite);
router.post('/resetpwd', ctrlUsers.resetPwd);

module.exports = router;
