/**
 * Created by Deebobo.dev on 22/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const winston = require('winston');

async function preparePlugin(pluginName, rec, plugins){

    if(pluginName in plugins.plugins){                  //check if the server side needs to do something for the connection.
        let plugin = plugins.plugins[pluginName].create();
        await plugin.connect(rec.content);                    //check for the connection to succeed
        await plugin.create(rec.content);                                //make certain that everything is set up correctly for the plugin.
        await plugin.close();                                   //close it again, don't want to keep 1000+ connections open at the same time.
    }
}


/* create a connection */
module.exports.create = async function(plugins, rec, pluginName) {
    let db = plugins.db;
    let newRec = await db.connections.add(rec);
    try {
        await preparePlugin(pluginName, rec, plugins);                    //do after add, so that a failure will only cause a warning.
    }
    catch (err){
        winston.log("warning", err);
        rec.warning = err;
        newRec = await db.connections.update(rec);                               //store the warning in the db, so it is persisted: user can see the warning also the next time it is opened.
    }
    return newRec;
};

module.exports.update = async function(plugins, rec, pluginName){
    let db = plugins.db;
    rec.warning = "";                                                       //reset any warnings before saving
    let newRec = await db.connections.update(rec);
    try {
        await preparePlugin(pluginName, rec, plugins);                    //do after add, so that a failure will only cause a warning.
    }
    catch (err){
        winston.log("warning", err);
        rec.warning = err;
        newRec = await db.connections.update(rec);                               //store the warning in the db, so it is persisted: user can see the warning also the next time it is opened.
    }
    return newRec;
};