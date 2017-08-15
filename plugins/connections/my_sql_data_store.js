/**
 * Created by Deebobo.dev on 4/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const mysql = require('mysql');
const winston = require('winston');

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
     * @param dbCreated {bool} true if the db is already created and the connect can specify the db name.
     */
    async connect(connectionInfo){
        let self = this;
        return new Promise((resolve, reject) => {
                self.con = mysql.createConnection({
                    host: connectionInfo.url,
                    user: connectionInfo.username,
                    password: connectionInfo.password,
                    database: connectionInfo.dbName
                });
                self.con.connect(function (err) {
                    if (err) {
                        winston.log("error", 'connection failed', connectionInfo);
                        reject(err);
                    }
                    else {
                        winston.log("info", 'connected to', connectionInfo);
                        resolve();
                    }
                });
            }
        );

    }

    /**
     * closes the connection.
     * @returns {Promise.<void>}
     */
    async close(){
        return new Promise((resolve, reject) => {
            if(this.con)
                this.con.destroy();
            resolve();
        });
    }

    /**
     * called when a connection is created (after connect is called, so the db is already connected).
     * Makes certain that the db and table exist (if need be)
     *
     * table fields
     * - time: date
     * - site: string: name of the site/application that owns the data.
     * - source: id of connection that stored the data  (ex: source = particle.io connection) .
     * - device: unique identifier (within the source) for the device
     * - field: unique identifier of field within device (optional)
     * - data: json data value.
     */
    async create(connectionInfo){
        let self = this;
        return new Promise((resolve, reject) => {
            if(self.con){

                try{
                    if(connectionInfo.createTable){
                        var sql = "CREATE TABLE " + connectionInfo.tableName + " (time datetime, site VARCHAR(255), source VARCHAR(255), device VARCHAR(255), field VARCHAR(255), data JSON   )";
                        self.con.query(sql, function (err, result, fields) {
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
                    else
                        resolve(null);
                }
                catch (err){
                    reject(err);
                }
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
        if(filter.hasOwnProperty('to')  && filter.to)
            res += 'time <= "' + filter.to + '"';
        if(filter.hasOwnProperty('from') && filter.from)
            res += (res.length > 0 ? ' and ' : '') + 'time >= "' + filter.from  + '"';
        if(filter.hasOwnProperty('source') && filter.source)
            res += (res.length > 0 ? ' and ' : '') + 'source = "' + filter.source + '"';
        if(filter.hasOwnProperty('device') && filter.device)
            res += (res.length > 0 ? ' and ' : '') + 'device = "' + filter.device + '"';
        if(filter.hasOwnProperty('field') && filter.field)
            res += (res.length > 0 ? ' and ' : '') + 'field = "' + filter.field + '"';
        if(filter.hasOwnProperty('site') && filter.site)
            res += (res.length > 0 ? ' and ' : '') + 'site = "' + filter.site + '"';

        if(res.length > 0)
            res = " WHERE " + res;

        if(filter.hasOwnProperty('page') && filter.page){
            let pagesize = 50;
            if(filter.hasOwnProperty('pagesize') && filter.pagesize)
                pagesize = parseInt(filter.pagesize);

            res += ' LIMIT ' + (parseInt(filter.page) * pagesize).toString() + ', ' + pagesize.toString();
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
    async queryHistory(connectionInfo, filter){
        let self = this;
        return new Promise((resolve, reject) => {
            if(this.con){
                var sql = "SELECT time, device, source, field, data from " + connectionInfo.tableName + self._buildWhere(filter);
                self.con.query(sql, function (err, result, fields) {
                    if (err) {
                        reject(err);
                        winston.log("error", 'table query failed', sql);
                    }
                    else {
                        resolve(result);
                    }
                });
            }
            else
                reject("connection is not opened")
        });
    }

    async getTimerange(connectionInfo, filter){
        let self = this;
        return new Promise((resolve, reject) => {
            if(this.con){
                var sql = "SELECT MIN(time) as min, MAX(time) as max from " + connectionInfo.tableName + self._buildWhere(filter);
                self.con.query(sql, function (err, result, fields) {
                    if (err) {
                        reject(err);
                        winston.log("error", 'table query failed', sql);
                    }
                    else {
                        resolve(result);
                    }
                });
            }
            else
                reject("connection is not opened")
        });
    }

    /**
     * called by a function to store data in the db.
     * @param connectionInfo {object} the connection definition reocord.
     * @param data: the data to store in the db.
     * @returns {Promise}
     */
    async storeHistory(site, data, connectionInfo){
        let self = this;
        return new Promise((resolve, reject) => {
            if(!this.con)
                reject("connection not opened");
            if(typeof data.data === "string")
                var sql = "INSERT INTO " + connectionInfo.content.tableName + " (time, site, source, device, field, data) VALUES ('"
                    + data.published_at + "', '"
                    + site + "', '"
                    + connectionInfo.name + "', '"
                    + data.coreid + "', '"
                    + data.event + "', '"
                    + JSON.stringify(data.data) + "')";
            self.con.query(sql, function (err, result, fields) {
                if (err) {
                    reject(err);
                    winston.log("error", 'store historical data failed', err);
                }
                else {
                    resolve(result);
                    winston.log("info", 'historical data saved', result);
                }
            });
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