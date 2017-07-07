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
 * a plugin that provides access to a mysql data store for storing and retrieving time series, historical data of
 * devices from different connection sources.
 */
class ParticleIoConnection {

    constructor(){
    }


    /**
     * registers a function that will be called when a data event arrives on this connection.
     * @param definition
     * * @param req {Object} the request object that triggered this operation (used for building urls, getting user info and such.
     */
    async registerCallback(connection, definition, req){
        definition.data.webhookIds = [];
        for(let i=0; i< definition.data.extra.fields.length; i++){
            let id = await particle.createWebhook({
                name: definition.data.extra.fields[i],
                url: req.protocol + '://' + req.get('host') + req.originalUrl + "/" + definition._id + '/data',
                requestType: "POST",
                headers: {jwt: req.cookies.jwt},
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