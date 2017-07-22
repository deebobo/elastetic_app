/**
 * Created by Deebobo.dev on 4/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const mysql = require('mysql');
const Particle = require('particle-api-js');
const winston = require('winston');

let particle = new Particle();

/**
 * a plugin that allows the backend to work with the particle.io platform.
 * currently supports:
 * - callbacks
 */
class ParticleIoConnection {

    constructor(){
    }


    /**
     * registers a function that will be called when a data event arrives on this connection.
     * @param definition
     * * @param url {String} the url to register the callback to.
     */
    async registerCallback(connection, definition, url){
        definition.data.webhookIds = [];
        for(let i=0; i< definition.data.extra.fields.length; i++){
            let id = await particle.createWebhook({
                name: definition.data.extra.fields[i],
                url: url,
                requestType: "POST",
                headers: {jwt: definition.data.token},
                auth: connection.content.token
            });
            definition.data.webhookIds.push(id);                                                //store the id so we can delete it later on again.
        }
    }

    async unRegisterCallback(connection, definition){
        if(definition.data.webhookIds){
            for(let i=0; i< definition.data.webhookIds.length; i++){
                await particle.deleteWebhook({hookId: definition.data.webhookIds[i], auth: connection.content.token});
            }
            definition.data.webhookIds = [];
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
        author: "DeeBobo",
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