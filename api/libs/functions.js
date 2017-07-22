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
    if(pluginName in plugins.plugins) {
        let db = plugins.db;
        let newRec = await db.functions.add(rec);
        let plugin = plugins.plugins[pluginName].create();
        try {
            if (plugin.create)             //try to create the function after storing the def, cause the plugin might need the id of the newly ceated record. also: if the create fails, it is still stored for the user
                if (await plugin.create(plugins, newRec, host))    //the plugin could hvae changed the record, so it needs to be saved again. (ex: particle io stores the webhookid, so it can be deleted again.
                    newRec = await db.functions.update(rec);
        }
        catch(err){
            winston.log("warning", err);
            newRec.warning = err;
            newRec = await db.functions.update(newRec);                               //store the warning in the db, so it is persisted: user can see the warning also the next time it is opened.
        }
        return newRec;
    }
    else
        throw Error("unknown function name: " + pluginName);
};

module.exports.update = async function (plugin, pluginName, rec){
    if(pluginName in plugins.plugins) {
        rec.warning = "";                                                       //reset any warnings before saving
        let newRec = await db.functions.update(req.params.funcInstance, rec);
        let db = plugins.db;
        let plugin = plugins.plugins[pluginName].create();
        try {
            if (plugin.update)             //try to create the function after storing the def, this way, if the create fails, it is still stored for the user
                if (await plugin.update(plugins, rec, newRec, req))
                    newRec = await db.functions.update(newRec);
        }
        catch (err) {
            winston.log("warning", err);
            newRec.warning = err;
            newRec = await db.functions.update(newRec);                               //store the warning in the db, so it is persisted: user can see the warning also the next time it is opened.
        }
        return newRec;
    }
    else
        throw Error("unknown function name: " + pluginName);
};