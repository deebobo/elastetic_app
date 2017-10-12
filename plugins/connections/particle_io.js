/**
 * Created by elastetic.dev on 4/07/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

"use strict";

const mysql = require('mysql');
const Particle = require('particle-api-js');
const winston = require('winston');
const Connection = require.main.require('../plugins/base_classes/connection');

let particle = new Particle();

/**
 * a plugin that allows the backend to work with the particle.io platform.
 * currently supports:
 * - callbacks
 */
class ParticleIoConnection extends Connection {

    constructor(){
        super();
    }


    /**
     * registers a function that will be called when a data event arrives on this connection.
     * @param definition
     *
     */
    async registerCallback(plugins, connection, definition, host){
        if(!("content" in connection))
            connection.content = {callbacks: {}};
        else if(!("callbacks" in connection.content))
            connection.content.callbacks = {};


        if(! connection.content.authToken) {
            await this.createCallbackToken(plugins, connection);
        }
        let url = host + "/api/site/" + connection.site + "/connection/" + connection._id + "/call";

        for(let i=0; i< definition.data.extra.fields.length; i++){
            let field = definition.data.extra.fields[i];
            if(!(field  in connection.content.callbacks)){                      //no need to register the multiple callbacks for the same field
                let id = await particle.createWebhook({
                    name: field,
                    url: url,
                    requestType: "POST",
                    headers: {jwt: connection.content.authToken},
                    auth: connection.content.token
                });
                connection.content.callbacks[field] = {webhook: id.body.id, functions:[definition.name]} ;                                                //store the id so we can delete it later on again.
            }
            else
                connection.content.callbacks[field].functions.push(definition.name);
        }
        await plugins.db.connections.update(connection);                    //need to save the connection. It
    }

    /**
     * unregister the callback for a single function
     * @param plugins {Object} reference to the plugin manager
     * @param connection {Object} the definition for the connection.
     * @param definition {Object} the definition of the function doing the callback request.
     * @returns {Promise.<void>}
     */
    async unRegisterCallback(plugins, connection, definition){
        for(let i=0; i< definition.data.extra.fields.length; i++){
            let field = definition.data.extra.fields[i];
            if(connection.content && connection.content.callbacks){
                let list = connection.content.callbacks[field].functions;
                let index = list.indexOf(definition.name);
                if(index > -1){                                                                     //dont need to do anthing if not in list
                    list.splice(index, 1);
                    if(list.length === 0){                //no more registered observers for field, so delete the callback at particle and remove the field ref from the internal data.
                        try{
                            await particle.deleteWebhook({hookId: connection.content.callbacks[field].webhook, auth: connection.content.token});
                        }
                        catch(err){
                            winston.log("error", "failed to delete webhook (non fatal)", connection.content.callbacks[field].webhook, "connection:", connection.name, "site:", connection.site)
                        }
                        delete connection.content.callbacks[field];
                    }
                }
            }
        }
    }

    /**
     * unregisters all the callback of the connection. This is for deletion or recreating the authentication tokens.
     * @param plugins {Object} reference to the plugin manager
     * @param connection {Object} the definition for the connection.
     * @returns {Promise.<void>}
     */
    async unRegisterCallbacks(plugins, connection){
        if(connection.content && connection.content.callbacks){
            for(let field in connection.content.callbacks){
                try{
                    await particle.deleteWebhook({hookId: connection.content.callbacks[field].webhook, auth: connection.content.token});
                }
                catch(err){
                    winston.log("error", "failed to delete webhook (non fatal)", connection.content.callbacks[field].webhook, "connection:", connection.name, "site:", connection.site)
                }
            }
        }
    }

    /**
     * recreates the webhooks at particle.io.  Changes the connection object, but doesn't save it.
     * @param plugins {Object} ref to the plugin manager
     * @param host {String} host part of callback uri, for building the full uri.
     * @param connection {Object} the connection.
     * @returns {Promise.<void>}
     */
    async reRegisterCallbacks(plugins, host, connection){
        if(connection.content && connection.content.callbacks){
            let url = host + "/api/site/" + connection.site + "/connection/" + connection._id + "/call";
            for(let field in connection.content.callbacks){
                let id = await particle.createWebhook({
                    name: field,
                    url: url,
                    requestType: "POST",
                    headers: {jwt: connection.content.authToken},
                    auth: connection.content.token
                });
                connection.content.callbacks[field].webhook = id.body.id;                                                //store the id so we can delete it later on again.
            }
        }
    }

    /**
     * refreshes the authentication token and re-registers all the callbacks.
     * @param plugins
     * @param connection
     * @returns {Promise.<void>}
     */
    async refreshToken(plugins, host, connection){
        let self = this;
        await self.unRegisterCallbacks(plugins, connection);
        await self.createCallbackToken(plugins, connection);
        await self.reRegisterCallbacks(plugins, host, connection);
        connection = await plugins.db.connections.update(connection);                //need to save the record, it was changed in multiple locations
        return connection;
    }

    /**
     * called when the connection is deleted. We need to unregister all the callbacks
     *
     * @param plugins
     * @param connection
     * @returns {Promise.<void>}
     */
    async destroy(plugins, connection){
        //todo: let all the functions know that this connection can no longer be a provider?
        await this.unRegisterCallbacks(plugins, connection);
    }

    /**
     * executes the callback (particle.io has send data to us).
     * @param plugins {Object} a ref to the plugins object, for finding the function plugins.
     * @param connection {Object} the function instance data (defines the connection source and destination)
     * @param rec {Object} the object with the data
     */
    async call(plugins, connection, rec){
		
		let field = rec.event;
		let functions = connection.content.callbacks[field].functions;
        let data = {device: rec.coreid, field: field, data: rec.data, timestamp: rec.published_at};
		for(let i = 0; i < functions.length; i++){
		    try {
                let func = await plugins.db.functions.find(functions[i], connection.site);
                if (func) {
                    let plugin = plugins.plugins[func.source.name].create();
                    let rdata = await plugin.call(plugins, func, connection, data);
                }
                else
                    winston.log("error", "unknown function reference from connection, id: " + functions[i]);
            }
            catch(e){
                winston.log("error", "unexpected error while trying to call function callback from connection, function: " + functions[i] + ", connection: particle.io");
            }
		}
    }
}


//required for all plugins. returns information about the plugin
let getPluginConfig = function (){
    return {
        name: "particle_io",
        category: "connection",
        title: "Particle.io",
        description: "a connection to your particle.io account",
        author: "elastetic",
        version: "0.0.1",
        icon: "https://www.mysql.com/common/logos/logo-mysql-170x115.png",
        license: "GPL-3.0",
        requires: {"particle-api-js": "^6.5.0"},
        config:{
            partial: "particle_io_config.html",
            code: ["particle_io_config.js"]
        },
        create: function(){ return new ParticleIoConnection();},
    };
};

module.exports = {getPluginConfig: getPluginConfig};