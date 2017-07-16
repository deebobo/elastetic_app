/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

 /**
 @ignore
 */
const config = require.main.require('../api/libs/config');
const mongoose = require('mongoose');
const winston = require('winston');
const usersModel = require.main.require('../plugins/models/mongo_users');
const groupsModel = require.main.require('../plugins/models/mongo_groups');
const sitesModel = require.main.require('../plugins/models/mongo_sites');
const pagesModel = require.main.require('../plugins/models/mongo_pages');
const viewsModel = require.main.require('../plugins/models/mongo_views');
const siteCollectionModel = require.main.require('../plugins/models/mongo_site_collection');
const emailTemplatesModel = require.main.require('../plugins/models/mongo_email_templates');
const pluginsModel = require.main.require('../plugins/models/mongo_plugins');
const connectionsModel = require.main.require('../plugins/models/mongo_connections');
const functionsModel = require.main.require('../plugins/models/mongo_functions');
const siteTemplatesModel = require.main.require('../plugins/models/mongo_site_templates');


/** provides a db connection with a mongo database  
*/
class MongoDb{
    /**create the object
	* This function is called with the new operator to create an object that represents the database. The function shouldn't do much more but set up an empty, not connected database.
    * @constructor
	*/
    constructor (){
        this.db = null;
        this.users = null;
        this.groups = null;
        this.sites = null;
		this.pages = null;
		this.pluginSiteData = null;
		this.emailTemplates = null;
		this.plugins = null;
		this.connections = null;
		this.views = null;
		this.functions = null;
		this.siteTemplates = null;
        mongoose.Promise = global.Promise;
    }

    /**
	create a connection with the database.  The objects should retrieve connection information from config.js (found in the root of the api).
	* @return {Promise} a promise to perform async operations with.
	*/
    connect(){
        return mongoose.connect(config.config.db_connection_string);
    }

	/**
   * Indicates whether there is a current and ready-to-use mongoose connection.
   *
   * @return {boolean}
   */
    isConnected() {
        return this.db && this.db.readyState === 1;
    }
	
	
	/**
    * create the database with all the required collections/tables: 
	* - [groups]()
    */
    createDb(){
        this.sites = new sitesModel();
		this.pluginSiteData = new siteCollectionModel();
		this.emailTemplates = new emailTemplatesModel();
        this.groups = new groupsModel();
        this.users = new usersModel();
        this.pages = new pagesModel();
		this.plugins = new pluginsModel();
		this.connections = new connectionsModel();
        this.functions = new functionsModel();
		this.views = new viewsModel();
        this.siteTemplates = new siteTemplatesModel();
    }


}

//required for all plugins. returns information about the plugin
let getPluginConfig = function (){
    return {
        name: "mongodb",
        category: "db",
        title: "store the data in a mongo database",
        description: "this is the default database used by deebobo",
        author: "DeeBobo",
        version: "0.0.1",
        icon: "/images/plugin_images/MongoDB_Gray_Logo_FullColor_RGB-01.jpg",
        license: "GPL-3.0",
        create: function(){ return new MongoDb();}
    };
};

module.exports = {getPluginConfig: getPluginConfig};