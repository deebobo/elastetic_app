/**
 * Created by Deebobo.dev on 22/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const winston = require('winston');

/**
 * creates the function
 * @param plugins {Object} ref to the plugin managers
 * @param pluginName {STring} name of the plugin
 * @param rec {object} record to create (definition of function)
 * @param host {String} protocol and host part of the URL, so functions/connections can register callbacks (create the url to call)
 * @returns {Promise.<*>}
 */
module.exports.create = async function(plugins, pluginName, rec, host){
    let db = plugins.db;
    let newRec = await db.functions.add(rec);
    if(pluginName in plugins.plugins) {
        let plugin = plugins.plugins[pluginName].create();
        try {
            if (plugin.create)             //try to create the function after storing the def, cause the plugin might need the id of the newly ceated record. also: if the create fails, it is still stored for the user
                await plugin.create(plugins, newRec, host);
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
            newRec = await db.functions.update(newRec._id, rec);                               //store the warning in the db, so it is persisted: user can see the warning also the next time it is opened.
        }
    }
    else if(pluginName)
        winston.log('error', "unknown function name", pluginName);
    return newRec;
};

module.exports.update = async function (plugins, pluginName, rec, host){
    rec.warning = "";                                                       //reset any warnings before saving
    let oldRec = await plugins.db.functions.update(rec._id, rec);
    if(pluginName in plugins.plugins) {
        let db = plugins.db;
        let plugin = plugins.plugins[pluginName].create();
        try {
            if (plugin.update)             //try to create the function after storing the def, this way, if the create fails, it is still stored for the user
                await plugin.update(plugins, oldRec, rec, host);
        }
        catch (err) {
            if("body" in err){                                  //particle.io webhook generates this type of error, no ohter way to figure it out
                winston.log("warning", err.body.error);
                rec.warning = err.body.error;
            }
            else{
                winston.log("warning", err);
                rec.warning = err.toString();
            }
            rec = await db.functions.update(rec._id, rec);                               //store the warning in the db, so it is persisted: user can see the warning also the next time it is opened.
        }
    }
    else
        throw Error("unknown function name: " + pluginName);
    return rec;
};