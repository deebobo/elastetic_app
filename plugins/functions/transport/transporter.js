/**
 * Created by Deebobo.dev on 4/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const winston = require('winston');
const Function = require.main.require('../plugins/base_classes/function');


class Transporter extends Function {

    constructor() {
		super();
    }

    /**
     * performs the function (transport data from source to dest).
     * @param plugins {Object} a ref to the plugins object, for finding the connection plugins.
     * @param funcDef {Object} the function instance data (defines the connection source and destination)
     * @param connection {Object} the connection from where the request originated.

	 * @param data {Object} the data to process
     */
    async call(plugins, funcDef, connection, data){
        let toConnection = await plugins.db.connections.find(funcDef.data.to, funcDef.site);
        if(toConnection){
            let to =  plugins.plugins[toConnection.plugin.name].create();
			await to.execute(plugins, toConnection, data);
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