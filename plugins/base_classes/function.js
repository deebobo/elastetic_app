/**
 * Created by elastetic.dev on 19/08/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

"use strict";
 
const winston = require('winston');


class Function {

    constructor() {

    }

    /**
     * create a tansport between the 2 connections and store it in the system
     * @param db {Object} ref to the db
     * @param funcDef {object} the object that represents a transport def.
     * @param host {String} protocol and host part of the URL, so functions/connections can register callbacks (create the url to call)
     * $returns None
     */
    async create(plugins, funcDef, host){
        if(!('to' in funcDef.data))
            throw Error("missing to field");
        if('from' in funcDef.data) {
            let fromConnection = await plugins.db.connections.find(funcDef.data.from, funcDef.site);
            if(!fromConnection)
                throw Error("unknown connection: " + funcDef.data.from);
            if(fromConnection.plugin.name in plugins.plugins){
                let plugin = plugins.plugins[fromConnection.plugin.name].create();
                if (plugin.registerCallback)
                    await plugin.registerCallback(plugins, fromConnection, funcDef, host);
            }
            else
                throw Error("unknown plugin: " + fromConnection.plugin.name);
        }
        else
            throw Error("missing from field");
    }

    /**
     * called when the function is deleted. This is a soft destroy, if there are any missing links, don't raise exception.
     * We are deleting, so always try to delete as much as possible, if missing ref, just continue
     * @param funcDef
     * @param db {Object} ref to the db
     */
    async destroy(plugins, funcDef){
        let fromConnection = await plugins.db.connections.find(funcDef.data.from, funcDef.site);
        if(fromConnection){
            if(funcDef.data.hasOwnProperty('from')) {
                if(fromConnection.plugin.name in plugins.plugins) {
                    let plugin = plugins.plugins[fromConnection.plugin.name].create();
                    if (plugin.unRegisterCallback) {
                        await plugin.unRegisterCallback(plugins, fromConnection, funcDef);
                        await plugins.db.connections.update(fromConnection);                    //unregister doesn't save the record (it's also used in delete), could chane the content though.
                    }
                }
            }
        }
    }

    /**
     * called when the function is changed.
     * @param oldFuncDef
     * @param newFuncDef
     */
    async update(plugins, oldFuncDef, newFuncDef, host){
        let self = this;
        await self.destroy(plugins, oldFuncDef);
        await self.create(plugins, newFuncDef, host);
    }


    /**
     * performs the function
     * @param plugins {Object} a ref to the plugins object, for finding the connection plugins.
     * @param funcDef {Object} the function instance data (defines the connection source and destination)
     * @param connection {Object} the connection from where the request originated.
	 
	 * @param device {string} the device identifier
	 * @param field {string} the field identifier
	 * @param data {Object} the data to process
     */
    async call(plugins, funcDef, connection, device, field, data){
        winston.log("error", "call not implemented", funcDef.name, "site:", funcDef.data.site)
    }
}

module.exports = Function;