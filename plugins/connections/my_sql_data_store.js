/**
 * Created by Deebobo.dev on 4/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const mysql = require('mysql');

/**
 * a plugin that provides access to a mysql data store for storing and retrieving time series, historical data of
 * devices from different connection sources.
 */
class MySqlDataStore {

    constructor(){
        this.con = null;
    }

    /**
     * initiate the connection using the specified connection information.
     * @param connectionInfo
     */
    async connect(connectionInfo){
        let self = this;
        return new Promise((resolve, reject) => {
                self.con = mysql.createConnection({
                    host: connectionInfo.url,
                    user: connectionInfo.username,
                    password: connectionInfo.password
                });
                self.con.connect(function (err) {
                    if (err) {
                        reject(err);
                        winston.log("error", 'connection failed', connectionInfo);
                    }
                    else {
                        resolve();
                        winston.log("info", 'connected to', connectionInfo);
                    }
                });
            }
        );

    }

    /**
     * called when a connection is created (after connect is called, so the db is already connected).
     * Makes certain that the db and table exist (if need be)
     *
     * table fields
     * - from: date
     * - to: date
     * - source: id of connection that stored the data  (ex: source = particle.io connection) .
     * - device: unique identifier (within the source) for the device
     * - field: unique identifier of field within device (optional)
     * - data: json data value.
     */
    create(connectionInfo){
        let self = this;
        return new Promise((resolve, reject) => {
            if(self.con){

                function createTable(){
                    if(connectionInfo.createTable){
                        var sql = "CREATE TABLE " + connectionInfo.tableName + " (time datetime, source: VARCHAR(255), device: VARCHAR(255), field: VARCHAR(255), data: JSON   )";
                        self.con.query(sql, function (err, result) {
                            if (err) {
                                winston.log("error", 'table creation failed', connectionInfo);
                                reject(err);
                            }
                            else {
                                winston.log("info", 'table created', connectionInfo);
                                resolve(result);
                            }
                        });
                    }
                }

                if(connectionInfo.createDb){
                    var sql = "CREATE DATABASE " + connectionInfo.dbName;
                    self.con.query(sql, function (err, result) {
                        if (err) {
                            winston.log("error", 'db creation failed', connectionInfo);
                            reject(err);
                        }
                        else {
                            winston.log("info", 'db created', connectionInfo);
                            createTable();
                        }
                    });
                }
                else
                    createTable();
            }
            else
                reject("connection is not opened")
        });
    }


    /**
     * create a string where clause based on the filter values.
     * @param filter
     * @private
     */
    _buildWhere(filter){
        let res = '';
        if(filter.hasOwnProperty('to'))
            res += 'time <= ' + filter.to;
        if(filter.hasOwnProperty('from'))
            res += res.length > 0 ? ' and ' : '' + 'time >= ' + filter.from;
        if(filter.hasOwnProperty('source'))
            res += res.length > 0 ? ' and ' : '' + 'source = ' + filter.source;
        if(filter.hasOwnProperty('device'))
            res += res.length > 0 ? ' and ' : '' + 'device = ' + filter.device;
        if(filter.hasOwnProperty('field'))
            res += res.length > 0 ? ' and ' : '' + 'field = ' + filter.field;

        if(res.length > 0)
            res = " WHERE " + res;

        if(filter.hasOwnProperty('page')){
            let pagesize = 50;
            if(filter.hasOwnProperty('pagesize'))
                pagesize = filter.pagesize;

            res += ' LIMIT ' + toString(filter.page * pagesize) + ', ' + toString(pagesize);
        }
        return res;
    }

    /**
     * query the connection for historical data.
     * @param filter an object used to filter the data. The object can contain the following fields:
     * -  from: date
     * - to: date
     * - source: id of connection that stored the data  (ex: source = particle.io connection) .
     * - device: unique identifier (within the source) for the device
     * - field: unique identifier of field within device (optional)
     * - page
     * - pagesize
     */
    queryHistory(filter){
        let self = this;
        return new Promise((resolve, reject) => {
            if(this.con){
                var sql = "SELECT * from " + connectionInfo.tableName + self.buildWhere(filter);
                self.con.query(sql, function (err, result, fields) {
                    if (err) {
                        reject(err);
                        winston.log("error", 'table creation failed', connectionInfo);
                    }
                    else {
                        resolve(result);
                        winston.log("info", 'table created', connectionInfo);
                    }
                });
            }
            else
                reject("connection is not opened")
        });
    }

    storeHistory(data){
        let self = this;
        return new Promise((resolve, reject) => {
            if(this.con){
                var sql = "INSERT INTO " + connectionInfo.tableName + "(time, source, device, field, data) VALUES ('"
                                                    + data.time + "', '" +
                                                    + data.source + "', '" +
                                                    + data.device + "', '" +
                                                    + data.field + "', " +
                                                    + toString(data.data) + ")";
                self.con.query(sql, function (err, result, fields) {
                    if (err) {
                        reject(err);
                        winston.log("error", 'table creation failed', connectionInfo);
                    }
                    else {
                        resolve(result);
                        winston.log("info", 'table created', connectionInfo);
                    }
                });
            }
            else
                reject("connection is not opened")
        });
    }
}


//required for all plugins. returns information about the plugin
let getPluginConfig = function (){
    return {
        name: "my_sql_data_store",
        category: "connection",
        title: "My sql data store",
        description: "a connection to your mysql database for the historical data of your devices from other connections",
        author: "DeeBobo",
        version: "0.0.1",
        icon: "https://www.mysql.com/common/logos/logo-mysql-170x115.png",
        license: "GPL-3.0",
        requires: {"mysql": "^2.13.0"},
        config:{
            partial: "my_sql_data_store_config_partial.html",
            code: ["my_sql_data_store_config_controller.js"]
        },
        create: function(){ return new MySqlDataStore();}
    };
};

module.exports = {getPluginConfig: getPluginConfig};