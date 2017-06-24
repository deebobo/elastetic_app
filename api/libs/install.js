/**
 * Created by Deebobo.dev on 24/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const config = require.main.require('../api/libs/config');
const winston = require('winston');
const sitesLib = require.main.require('../api/libs/sites');

async function installPlugin(db, pluginName, file)
{
    let def = require.main.require(file);
    def.site = "_common";
    if(def.hasOwnProperty('client')){
        for(path = 0; path < def.client.scripts.length; path++)
            def.client.scripts[path] = "_common/" + pluginName + '/' + def.client.scripts[path]
        for(path = 0; path < def.client.partials.length; path++)
            def.client.partials[path] = "_common/" + pluginName + '/' + def.client.partials[path]
    }
    if(def.hasOwnProperty('config')){
        for(path = 0; path < def.config.scripts.length; path++)
            def.config.scripts[path] = "_common/" + pluginName + '/' + def.config.scripts[path]
        for(path = 0; path < def.config.partials.length; path++)
            def.config.partials[path] = "_common/" + pluginName + '/' + def.config.partials[path]
    }
    try{
        await db.plugins.add(def);
        winston.log("info", "succesfully installed plugin", file);
    }
    catch(err){
        winston.log("errro", "failed to instal plugin", file);
    }
}

async function installPlugins(db)
{
    winston.log("info", "installing plugins...");
    await installPlugin(db, 'private mail', '../public/plugins/_common/private mail/pluginconfig.json');
    await installPlugin(db, 'left_menu_bar_page', '../public/plugins/_common/left_menu_bar_page/pluginconfig.json');
    await installPlugin(db, 'particle_io', '../public/plugins/_common/particle_io/pluginconfig.json');
}

async function install(plugins, result)
{
    config.config.db = result.db;
    plugins.load();                                 //after assigning the db type, need to load the db in the plugin.
    let db = plugins.db;
    if(db == null)
        winston.log("error", "unknown db type", result.db);
    else
    {
        config.config.db_connection_string = result.dbpath;
        try {
            await db.connect();
            winston.log('info', 'succesfully connected to db');
        }
        catch (err) {
            winston.log('error', 'failed to connect db:', err);
        }
        try {
            db.createDb();
            await installPlugins(db);
        }
        catch (err) {
            winston.log('error', 'failed to create db or install plugins:', err);
        }
        try {
            await sitesLib.create(db, 'main', result.name, result.email, result.password);
            await config.save();
            winston.log('info', 'done');
        }
        catch (err) {
            winston.log('error', 'failed to populate db with initial values:', err);
        }
    }
}
module.exports.install = install;