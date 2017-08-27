/**
 * Created by Deebobo.dev on 10/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const auth = require.main.require('../api/libs/auth');
const funcLib = require.main.require('../api/libs/functions');
const winston = require('winston');

/**
 * makes certain that the plugin field is an id, not an object.
 * @param rec
 * @returns {string} the name of the plugin
 */
function cleanPluginRef(db, rec){
    let pluginName = null;
    if(typeof rec.source !== 'string') {                //update the rec to id if needbee and retrieve the name of the plugin so we can find any server side version of it.
        pluginName = rec.source.name;
        rec.source = rec.source._id;
    }
    else {
        let pluginref = db.plugins.findById(rec.source);
        pluginName = pluginref.source;
    }
    return pluginName;
}

/* GET  list of function instances for a function.
 *  */
module.exports.get = async function(req, res)
{
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        let result = await db.functions.list(req.params.site);
        res.status(200).json(result);
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/* GET single function instance, if the requestor is allowed to see it. */
module.exports.getInstance = async function(req, res) {
    let page = null;
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        let result = await db.functions.findById(req.params.funcInstance);
        res.status(200).json(result);
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};


/* create a function instance */
module.exports.create = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let plugins = await req.app.get('plugins');
            let db = plugins.db;
            let pluginName = cleanPluginRef(db, req.body);
            let rec = {data: req.body.data, site: req.params.site, source: req.body.source, name: req.body.name};
            try {
                rec = await funcLib.create(plugins, pluginName, rec, req.protocol + '://' + req.get('host'));
                res.status(200).json(rec);
            }
            catch(err){
                res.status(403).json({message:err.message});
            }
        }
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/* update a function instance. */
module.exports.update = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let plugins = await req.app.get('plugins');
            let db = plugins.db;
            let rec = req.body;
            let pluginName = cleanPluginRef(db, rec);
            try {
                rec = await funcLib.update(plugins, pluginName, rec, req.protocol + '://' + req.get('host'));
                res.status(200).json(rec);
            }
            catch(err){
                res.status(403).json({message:err.message});
            }
        }
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/* delete the specified function instance. */
module.exports.delete = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let plugins = await req.app.get('plugins');
            let db = plugins.db;
            let rec = await db.functions.findById(req.params.funcInstance);
            await db.functions.delete(req.params.funcInstance);
            try {
                let plugin = plugins.plugins[rec.source.name].create();
                if (plugin.destroy)             //try to create the function after storing the def, this way, if the create fails, it is still stored for the user
                    await plugin.destroy(plugins, rec);
            }
            catch (err){
                if(!rec) rec = {};
                rec.warning = "failed to clean up the function: " + toString(err);
                winston.log("error", err);
            }
            res.status(200).json(rec);
        }
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};
