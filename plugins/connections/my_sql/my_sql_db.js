/**
 * Created by Deebobo.dev on 4/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const mysql = require('mysql');
const winston = require('winston');
const MySqlConnection = require.main.require('../plugins/connections/my_sql/my_sql_connection');

/**
 * a plugin that provides access to a mysql data store. This class provides the plugin infrastructure for the
 * core mysql connection. Other plugins are responsible for connections to individual tables/storage models.
 */
class MySqlDb extends MySqlConnection{

    constructor(){
        super();
    }
}


//required for all plugins. returns information about the plugin
let getPluginConfig = function (){
    return {
        name: "my_sql_db",
        category: "connection",
        title: "My sql data store",
        description: "a connection to your mysql database",
        author: "DeeBobo",
        version: "0.0.1",
        icon: "https://www.mysql.com/common/logos/logo-mysql-170x115.png",
        license: "GPL-3.0",
        requires: {"mysql": "^2.13.0"},
        config:{
            partial: "my_sql_db_config_partial.html",
            code: []
        },
        create: function(){ return new MySqlDb();}
    };
};

module.exports = {getPluginConfig: getPluginConfig};