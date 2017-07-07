/**
 * Created by Deebobo.dev on 10/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const auth = require.main.require('../api/libs/auth');
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
            if(pluginName in plugins.plugins) {
                let rec = {data: req.body.data, site: req.params.site, source: req.body.source, name: req.body.name};
                let newRec = await db.functions.add(rec);
                let plugin = plugins.plugins[pluginName].create();
                try {
                    if (plugin.create)             //try to create the function after storing the def, cause the plugin might need the id of the newly ceated record. also: if the create fails, it is still stored for the user
                        if (await plugin.create(plugins, newRec, req))    //the plugin has changed the record, so it needs to be saved again.
                            newRec = await db.functions.update(rec);
                }
                catch(err){
                    winston.log("warning", err);
                    newRec = {data: newRec, warning: err};
                }
                res.status(200).json(newRec);
            }
            else
                res.status(403).json({message:"unknown function name: " + req.body.source});
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
            let newRec = await db.functions.update(req.params.funcInstance, rec);
            let plugin = plugins.plugins[pluginName].create();
            try{
                if(plugin.update)             //try to create the function after storing the def, this way, if the create fails, it is still stored for the user
                    if(await plugin.update(plugins, rec, newRec, req))
                        newRec = await db.functions.update(newRec);
            }
            catch(err){
                winston.log("warning", err);
                newRec = {data: newRec, warning: err};
            }
            res.status(200).json(newRec);
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

/**
 * executes the function.
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
module.exports.call = async function(req, res){
    let page = null;
    try{
        let plugins = await req.app.get('plugins');
        let db = plugins.db;
        let record = await db.functions.findById(req.params.funcInstance);
        if(record) {
            let plugin = plugins.plugins[record.source.name].create();
            plugin.call(db, plugins, record, req.body);                             //do the function.
            res.status(200).json(result);
        }
        else {
            winston.log("error", "unknown function: " + req.params.funcInstance);
            res.status(403).json({message: "unknown function: " + req.params.funcInstance});
        }
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};