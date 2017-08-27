/**
 * Created by Deebobo.dev on 10/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict';

const winston = require('winston');
const auth = require.main.require('../api/libs/auth');
const connectionsLib = require.main.require('../api/libs/connections');

/* GET connections list.
   optionally provide a filter value through a variable. Example: GET connection?puglin=sdfsfiower
 *  */
module.exports.get = async function(req, res)
{
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        let result = await db.connections.list(req.params.site, req.query.plugin);
        res.status(200).json(result);
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/* GET single connection, if the requestor is allowed to see it. */
module.exports.getConnection = async function(req, res) {
    let page = null;
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        let connection = await db.connections.find(req.params.connection, req.params.site);
        res.status(200).json(connection);
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/**
 * makes certain that the plugin field is an id, not an object.
 * @param rec
 * @returns {string} the name of the plugin
 */
async function cleanPluginRef(rec, db){
    let pluginName = null;
    if(typeof rec.plugin !== 'string') {                //update the rec to id if needbee and retrieve the name of the plugin so we can find any server side version of it.
        pluginName = rec.plugin.name;
        rec.plugin = rec.plugin._id;
    }
    else{
        let pluginref = await db.plugins.findById(rec.plugin);
        pluginName = pluginref.name;
    }
    return pluginName;
}

/* create a connection */
module.exports.create = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let plugins = await req.app.get('plugins');
            let db = plugins.db;
            let rec = req.body;
            let pluginName = await cleanPluginRef(rec, db);
            rec.site = req.params.site;
            let newRec = await connectionsLib.create(plugins, rec, pluginName);
            res.status(200).json(newRec);
        }
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/* update a conneciton. */
module.exports.update = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let plugins = await req.app.get('plugins');
            let db = plugins.db;
            let rec = req.body;
            rec._id = req.params.connection;
            let pluginName = await cleanPluginRef(rec, db);
            let newRec = await connectionsLib.update(plugins, rec, pluginName);
            res.status(200).json(newRec);
        }
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

/* delete the specified conneciton. */
module.exports.delete = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let plugins = await req.app.get('plugins');
            let db = plugins.db;
            let oldRec = await db.connections.delete(req.params.connection);
            if(oldRec) {
                let plugin = plugins.plugins[oldRec.plugin.name].create();
                if("destroy" in plugin)
                    await plugin.destroy(plugins, oldRec);                             //let the connection know it was deleted..
                res.status(200).json(oldRec);
            }
            else {
                winston.log("error", "unknown connection: " + req.params.connection);
                res.status(403).json({message: "unknown function: " + req.params.connection});
            }
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
    winston.log("info", "webhook callback, params", req.body);
    try{
        let plugins = await req.app.get('plugins');
        let db = plugins.db;
        let connection = await db.connections.findById(req.params.connection);
        if(connection) {
            let plugin = plugins.plugins[connection.plugin.name].create();
            await plugin.call(plugins, connection, req.body);                             //do the function.
            res.status(200).json({result: "ok"});
        }
        else {
            winston.log("error", "unknown connection: " + req.params.connection);
            res.status(403).json({message: "unknown function: " + req.params.connection});
        }
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

module.exports.refreshToken = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let plugins = await req.app.get('plugins');
            let db = plugins.db;
            let rec = await db.connections.findById(req.params.connection);
            if(rec) {
                let plugin = plugins.plugins[rec.plugin.name].create();
                try {
                    rec.warning = "";
                    if("refreshToken" in plugin)
                        rec = await plugin.refreshToken(plugins, req.protocol + '://' + req.get('host'), rec);                             //let the connection know it was deleted..
                }
                catch(err){
                    if("body" in err){                                  //particle.io webhook generates this type of error, no ohter way to figure it out
                        winston.log("warning", err.body.error);
                        rec.warning = err.body.error;
                    }
                    else{
                        winston.log("warning", err);
                        rec.warning = err.toString();
                    }
                    rec = await db.connections.update(rec);                               //store the warning in the db, so it is persisted: user can see the warning also the next time it is opened.
                }
                res.status(200).json(rec);
            }
            else {
                winston.log("error", "unknown connection: " + req.params.connection);
                res.status(403).json({message: "unknown function: " + req.params.connection});
            }
        }
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};