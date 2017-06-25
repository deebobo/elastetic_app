/**
 * Created by Deebobo.dev on 27/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const installer = require.main.require('../api/libs/install');
 
var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next){
    try{
        res.render('install');
    }
    catch(err){
        return next(err);
    }
});

/* GET users listing. */
router.post('/', async function(req, res, next) {
    try{
        let pluginMan = await req.app.get('plugins');
        db = pluginMan.db;
        if(db == null) {                            //only install if not yet installed.
            installer.install(pluginMan, req.body);
        }
        res.redirect("/");                          //always redirect to home when isntallation is done.
    }
    catch(err){
        return next(err);
    }
});

module.exports = router;