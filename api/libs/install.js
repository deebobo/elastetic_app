/**
 * Created by Deebobo.dev on 24/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const config = require.main.require('../api/libs/config');
const winston = require('winston');
const sitesLib = require.main.require('../api/libs/sites');

/**
 * prepares the paths to the code (js, html, css) files for the specified section
 * @param section
 */
function prepareCode(section, pluginName){
    for(path = 0; path < section.scripts.length; path++)
        section.scripts[path] = "./plugins/_common/" + pluginName + '/' + section.scripts[path]
    if(section.hasOwnProperty('external')){
        section.scripts.push.apply(section.scripts, section.external);
    }
    for(path = 0; path < section.partials.length; path++)
        section.partials[path] = "_common/" + pluginName + '/' + section.partials[path]
    if(section.hasOwnProperty('css')){
        for(path = 0; path < section.css.length; path++)
            section.css[path] = "_common/" + pluginName + '/' + section.css[path]
    }
    if(section.hasOwnProperty('externalCss'))
        if(section.hasOwnProperty('css'))
            section.css.push.apply(section.css, section.externalCss);
        else
            section.css = section.externalCss;
}

async function installPlugin(db, pluginName, file)
{
    let def = require.main.require(file);
    def.site = "_common";
    if(def.hasOwnProperty('client'))
        prepareCode(def.client, pluginName);
    if(def.hasOwnProperty('config'))
        prepareCode(def.config, pluginName);
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
    await installPlugin(db, 'my_sql_data_store', '../public/plugins/_common/my_sql_data_store/pluginconfig.json');
    await installPlugin(db, 'left_menu_bar_page', '../public/plugins/_common/left_menu_bar_page/pluginconfig.json');
    await installPlugin(db, 'particle_io', '../public/plugins/_common/particle_io/pluginconfig.json');
    await installPlugin(db, 'particle_io_devices_view', '../public/plugins/_common/particle_io_devices_view/pluginconfig.json');
    await installPlugin(db, 'google_map_view', '../public/plugins/_common/google_map_view/pluginconfig.json');

    await installPlugin(db, 'transporter', '../public/plugins/_common/transporter/pluginconfig.json');
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