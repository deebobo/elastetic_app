/**
 * Created by Deebobo.dev on 4/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const winston = require('winston');

class Transporter {

    constructor() {

    }


    /**
     * create a tansport between the 2 connections and store it in the system
     * @param db {Object} ref to the db
     * @param funcDef {object} the object that represents a transport def.
     * @param req {Object} the request object that triggered this operation (used for building urls, getting user info and such.
     * $returns true if the functDe object has been changed and needs to be saved again in the db.
     */
    async create(plugins, funcDef, req){
        if(!funcDef.data.hasOwnProperty('to'))
            throw Error("missing to field");
        let fromConnection = await plugins.db.connections.find(funcDef.data.from, funcDef.site);
        if(funcDef.data.hasOwnProperty('from')) {
            if(fromConnection.plugin.name in plugins.plugins){
                let plugin = plugins.plugins[fromConnection.plugin.name].create();
                if (plugin.registerCallback)
                    await plugin.registerCallback(fromConnection, funcDef, req);
                return true;
            }
            else
                throw Error("unknown plugin: " + fromConnection.plugin.name);
        }
        else
            throw Error("missing from field");
        return false;
    }

    /**
     * called when the function is deleted
     * @param funcDef
     * @param db {Object} ref to the db
     */
    async destroy(plugins, funcDef){
        let fromConnection = await plugins.db.connections.find(funcDef.data.from, funcDef.site);
        if(funcDef.data.hasOwnProperty('from')) {
            if(fromConnection.plugin.name in plugins.plugins) {
                let plugin = plugins.plugins[fromConnection.plugin.name].create();
                if (plugin.unRegisterCallback)
                    await plugin.unRegisterCallback(fromConnection, funcDef);
            }
            else
                throw Error("unknown plugin: " + fromConnection.plugin.name);
        }
    }

    /**
     * called when the function is changed.
     * @param oldFuncDef
     * @param newFuncDef
     */
    async update(plugins, oldFuncDef, newFuncDef, req){
        await this.destroy(plugins, oldFuncDef);
        return this.create(plugins, newFuncDef, req);
    }


    /**
     * performs the function (transport data from source to dest).
     * @param plugins {Object} a ref to the plugins object, for finding the connection plugins.
     * @param funcDef {Object} the function instance data (defines the connection source and destination)
     * @param req {Object} the request object with all the param
     */
    async call(plugins, funcDef, req){
        let toConnection = await plugins.db.connections.find(funcDef.data.to, funcDef.site);
        if(toConnection){
            let to =  plugins.plugins[toConnection.plugin.name].create();
            await to.connect(toConnection.content);                                       //make certain that we have an open connection
            try{
                await to.storeHistory(req.params.site, req.body, toConnection);
            }
            finally {
                await to.close();                                           //make certain that the connection is closed again.
            }
        }
        else{
            winston.log("error", "failed to find connection:", funcDef.data.to, "site:", funcDef.data.site)
        }
    }
}

//required for all plugins. returns information about the plugin
let getPluginConfig = function (){
    return {
        name: "transporter",
        category: "function",
        title: "transporter",
        description: "transport streaming data from one connection to the historical data of another",
        author: "DeeBobo",
        version: "0.0.1",
        icon: "https://www.mysql.com/common/logos/logo-mysql-170x115.png",
        license: "GPL-3.0",
        config:{
            partial: "transporter_config_partial.html",
            code: ["transporter_config_controller.js"]
        },
        create: function(){ return new Transporter();}
    };
};

module.exports = {getPluginConfig: getPluginConfig};