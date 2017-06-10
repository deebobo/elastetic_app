/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const config = require.main.require('../api/libs/config').config;
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
        this.plugins = [];                                  //list of all the plugins, so that they can be accessed from the website (show them)
        //this._initPluginMonitor();
    }

    //load all the availble plugin modules with require.
    load(){
        this._loadDb();
    }

    //initialize the monitor that keeps track of when a plugin is added or removed.
    initPluginMonitor(){
        let self = this;                                            //need to make a copy of this var for the callbacks 'on', which have a different 'this' value
        this.monitor = new PluginLoader([path.join(__dirname, "plugins")]);
        this.monitor.on('pluginLoaded', function(pluginName, plugin){
                if('getPluginConfig' in plugin){
                    let info = plugin.getPluginConfig();
                    info.ref = plugin;                                              //make certain we get a reference to the actual object, so we can use it later on if need be.
                    self.plugins.push(info);
                    winston.log('info', 'plugin loaded: ', pluginName);
                }
            }
        );

        this.monitor.on('pluginUnloaded', function(pluginName, plugin){
                if(pluginName === self._dbPlugin.name){
                    winston.log('error', "can't unload the db: ", pluginName);
                    throw new Error("invalid operation: can't unload the db plugin")
                }
                let found = self.plugins.filter(function(el){
                        return el.plugin === plugin;
                    }
                );
                if( found.length === 1){
                    self.plugins.splice(self.plugins.indexOf(found[0]));
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
        let found = this.plugins.filter(function(el){
                return el.category === 'db' && el.name === config.db;
            }
        );
        if(found.length === 1){
            this._dbPlugin = found[0];
            this.db = new this._dbPlugin.create();      //create the
        }
        else{
            winston.log('error', 'failed to find plugin for db: ', config.db);
            throw new Error('failed to find plugin for db: ' + config.db)
        }
    }
}

module.exports = PluginManager;