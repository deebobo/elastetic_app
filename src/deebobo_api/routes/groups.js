var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        groups = await db.groups.listGroups('main');
        res.json(groups);
    }
    catch(err){
        return next(err);
    }
});

module.exports = router;
