/**
 * Created by Deebobo.dev on 4/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

class Transporter {

    constructor() {

    }


    /**
     * create a tansport between the 2 connections and store it in the system
     * @param from {object} the connection that will produce the data. Should havea registerCallback function
     * @param to {object} the connection that will store the data as historical data. Should have a storeHistory function
     */
    createTransport(site, db, from, to){

        function onData(data){
            to.storeHistory(data);
        }

        if(from.hasOwnProperty('registerCallback')) {
            from.registerCallback(onData);
        }

        let record = { site: site, source: "transporter", data: {from: from.name, to: to.name}};
        db.functionData.add(record)
    }

    load(db){

    }
}

let _transporter = new Transporter();                                       //the singleton object.

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
        create: function(){ return _transporter;},
        runAtStartup: function(db) {_transporter.load(db);}
    };
};

module.exports = {getPluginConfig: getPluginConfig};