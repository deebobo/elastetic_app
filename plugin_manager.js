/**
 * Created by elastetic.dev on 20/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const config = require.main.require('../api/libs/config');
const PluginLoader = require.main.require('../api/libs/plugin_loader').PluginLoader;       //auto load/unload server side plugins
const winston = require('winston');
const path = require("path");

/**
 * manages globally available server side plugins.
 */
class PluginManager {

    //create a plugin manager
    constructor (){
        this.db = null;
        this._dbPlugin = null;                                //a reference to the plugin object itself (the id record), so we can see if the user is trying to unload the db plugin, whichi is illegal
        this._plugins = [];                                  //list of all the plugins, so that they can be accessed from the website (show them)
        this.plugins = {};                                   //fast access to the plugins
        //this._initPluginMonitor();
    }

    //load all the availble plugin modules with require.
    load(){
        this._loadDb();
    }
	
	/** returns the mail handler plugin for the specified site, if there is any.
     * Searches for a plugin with the specified name
	*/
	async getMailHandlerDefFor(site){
		if(this.db !== null){
			try{
				let found_site = await this.db.sites.find(site);
				if(found_site) {
                    return this.db.plugins.find(found_site.mailHandler, '_common');       //server plugins are always registered under _common cause only site 'main' can upload them (only the main admins can do soe)
                }
			}
			catch(err){
				winston.log('error', 'request for email plugin failed:', err);
			}
		}
		winston.log('error', 'request for email plugin not satisfied');
		return null;
	}

    /** returns the mail handler plugin for the specified site, if there is any.
     */
    async getMailHandlerFor(site){
        if(this.db !== null){
            try{
                let found_site = await this.db.sites.find(site);
                if(found_site){
                    if(found_site.mailHandler in this.plugins)
                        return this.plugins[found_site.mailHandler].create();
                }
            }
            catch(err){
                winston.log('error', 'request for email plugin failed:', err);
            }
        }
        winston.log('error', 'request for email plugin not satisfied');
        return null;
    }


    //initialize the monitor that keeps track of when a plugin is added or removed.
    initPluginMonitor(){
        let self = this;                                            //need to make a copy of this var for the callbacks 'on', which have a different 'this' value
        this.monitor = new PluginLoader([path.join(__dirname, "plugins")]);
        this.monitor.on('pluginLoaded', function(pluginName, plugin){
                if('getPluginConfig' in plugin){
                    let info = plugin.getPluginConfig();
                    if(info.name in self.plugins)
                        winston.log('error', 'a plugin with the name: ' + pluginName + " already exists");
                    else {
                        info.ref = plugin;                                              //make certain we get a reference to the actual object, so we can use it later on if need be.
                        self._plugins.push(info);
                        self.plugins[info.name] = info;
                        winston.log('info', 'plugin loaded: ', pluginName);
                    }
                }
            }
        );

        this.monitor.on('pluginUnloaded', function(pluginName, plugin){
                if(pluginName === self._dbPlugin.name){
                    winston.log('error', "can't unload the db: ", pluginName);
                    throw new Error("invalid operation: can't unload the db plugin")
                }
                let found = self._plugins.filter(function(el){
                        return el.plugin === plugin;
                    }
                );
                if( found.length === 1){
                    delete self.plugins[found[0].name];
                    self._plugins.splice(self._plugins.indexOf(found[0]));
                    winston.log('info', 'plugin unloaded: ', pluginName);
                }
                else{
                    winston.log('error', 'plugin to unload not found: ', pluginName);
                }
            }
        );
        this.monitor.startMonitoring();
    }

    //loads the database plugin into the plugin.
    _loadDb(){
        if(config.config.db in this.plugins){
            let found = this.plugins[config.config.db];
            this._dbPlugin = found;
            this.db = this._dbPlugin.create();      //create the
        }
        else{
            winston.log('error', 'failed to find plugin for db: ', config.config.db);
            throw new Error('failed to find plugin for db: ' + config.config.db)
        }
    }
}

module.exports = PluginManager;