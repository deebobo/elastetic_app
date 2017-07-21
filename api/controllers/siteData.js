/**
 * Created by Deebobo.dev on 10/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const winston = require('winston');
const auth = require.main.require('../api/libs/auth');

module.exports.get = async function(req, res)
{
	try{
        let db = await req.app.get('plugins');
        db = db.db;
        let result = await db.pluginSiteData.get(req.params.site, req.query.plugin);
        res.status(200).json(result);
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
}

/* create a data element */
module.exports.post = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let plugins = await req.app.get('plugins');
            let db = plugins.db;
            let rec = req.body;
            rec.site = req.params.site;
			rec.plugin = req.params.plugin;
            let newRec = await db.pluginSiteData.add(rec);
            res.status(200).json(newRec);
        }
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/* update a conneciton. */
module.exports.put = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let plugins = await req.app.get('plugins');
            let db = plugins.db;
            let rec = req.body;
            let newRec = await db.pluginSiteData.update(rec);
            res.status(200).json(newRec);
        }
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};