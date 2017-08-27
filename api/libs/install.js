/**
 * Created by Deebobo.dev on 24/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const config = require.main.require('../api/libs/config');
const winston = require('winston');
const sitesLib = require.main.require('../api/libs/sites');


async function installPlugins(db)
{
    winston.log("info", "installing plugins...");
    await sitesLib.installPlugin(db, 'private mail', '_common', '../public/plugins/_common/private mail/pluginconfig.json');
    await sitesLib.installPlugin(db, 'my_sql_db', '_common', '../public/plugins/_common/my_sql_db/pluginconfig.json');
    await sitesLib.installPlugin(db, 'left_menu_bar_page', '_common', '../public/plugins/_common/left_menu_bar_page/pluginconfig.json');
    await sitesLib.installPlugin(db, 'particle_io', '_common', '../public/plugins/_common/particle_io/pluginconfig.json');
    await sitesLib.installPlugin(db, 'particle_io_devices_view', '_common', '../public/plugins/_common/particle_io_devices_view/pluginconfig.json');
    await sitesLib.installPlugin(db, 'google_map_view', '_common', '../public/plugins/_common/google_map_view/pluginconfig.json');

    await sitesLib.installPlugin(db, 'transporter', '_common', '../public/plugins/_common/transporter/pluginconfig.json');
    await sitesLib.installPlugin(db, 'my_sql_historical_data', '_common', '../public/plugins/_common/my_sql_historical_data/pluginconfig.json');
    await sitesLib.installPlugin(db, 'my_sql_poi_data', '_common', '../public/plugins/_common/poi_calculator/pluginconfig.json');

}

/**
 * installs all the available templates.
 * @param db
 * @returns {Promise.<void>}
 */
async function installTemplates(db)
{
    await sitesLib.installTemplate(db, "track and trace", '../site_templates/trackAndTrace.json');
}

/**
 * installs the application
 * @param plugins {Object} plugin manager
 * @param result {Object} definition of the main site to install
 * @param host {String} protocol and host part of the URL, so functions/connections can register callbacks (create the url to call)
 * @returns {Promise.<void>}
 */
async function install(plugins, result, host)
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
            await installTemplates(db);
        }
        catch (err) {
            winston.log('error', 'failed to create db or install plugins:', err);
        }
        try {
            result.site = "main";
            await sitesLib.create(plugins,  result, host);
            await config.save();
            winston.log('info', 'done');
        }
        catch (err) {
            winston.log('error', 'failed to populate db with initial values:', err);
        }
    }
}
module.exports.install = install;