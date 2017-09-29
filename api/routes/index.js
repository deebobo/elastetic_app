/**
 * Created by elastetic.dev on 27/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

var express = require('express');
var router = express.Router({mergeParams: true});

/* GET users listing. */
router.get('/', function(req, res, next) {
    try{
        res.render('index', { title: 'elastetic' });
    }
    catch(err){
        return next(err);
    }
});

module.exports = router;
