/**
 * Created by Deebobo.dev on 10/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
//const auth = require.main.require('../api/libs/auth');
const winston = require('winston');

/* GET available skins. */
module.exports.list = async function(req, res)
{
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        let res = await db.skins.list(req.params.site);
        res.status(200).res.json(res);
		winston.log("warning", "add check to see if user has admin rights");
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};



/* set the new skin. */
module.exports.set = async function(req, res) {
    try{
        //todo: set the new skin
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};