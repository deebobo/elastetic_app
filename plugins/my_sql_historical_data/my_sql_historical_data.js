/**
 * Created by Deebobo.dev on 4/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const mysql = require('mysql');
const winston = require('winston');
const MySqlConnection = require.main.require('../plugins/connections/my_sql/my_sql_connection');

/**
 * a plugin that provides access to a mysql data store for storing and retrieving time series, historical data of
 * devices from different connection sources.
 */
class MySqlHistoricalData extends MySqlConnection {

    constructor(){
        super();
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
        if('to' in filter  && filter.to)
            res += 'time <= "' + filter.to + '"';
        if('from' in filter && filter.from)
            res += (res.length > 0 ? ' and ' : '') + 'time >= "' + filter.from  + '"';
        if('source' in filter && filter.source)
            res += (res.length > 0 ? ' and ' : '') + 'source = "' + filter.source + '"';
        if('device' in filter && filter.device)
            res += (res.length > 0 ? ' and ' : '') + 'device = "' + filter.device + '"';
        if('field' in filter && filter.field)
            res += (res.length > 0 ? ' and ' : '') + 'field = "' + filter.field + '"';
        if('site' in filter && filter.site)
            res += (res.length > 0 ? ' and ' : '') + 'site = "' + filter.site + '"';

        if(res.length > 0)
            res = " WHERE " + res;

        if('page' in filter && filter.page){
            let pagesize = 50;
            if('pagesize' in filter && filter.pagesize)
                pagesize = parseInt(filter.pagesize);

            res += ' LIMIT ' + (parseInt(filter.page) * pagesize).toString() + ', ' + pagesize.toString();
        }
        return res;
    }


    /**
     * called when a connection is created (after connect is called, so the db is already connected).
     * Makes certain that the db and table exist (if need be)
     *
     * table fields
     * - site: string: name of the site/application that owns the data.
     * - source: id of connection that stored the data  (ex: source = particle.io connection) .
     * - device: unique identifier (within the source) for the device
     * - lat, lng: coordinates of the point of iterest
     * - name: name of the point of interest.
     * - count: the nr of times that the POI has been found
     * - duration: amount of time spent on same poi, expressed in seconds
     * - time: last time that point was visited
     */
    async createConnection(plugins, connectionInfo){
        let self = this;

        await self.connect(plugins, connectionInfo);                                       //make certain that we have an open connection
        try{
            if(connectionInfo.content.createTable){
                await self.create(connectionInfo);
            }
        }
        finally {
            await self.close();                                           //make certain that the connection is closed again.
        }
    }

    /** execute this connection .
     * @param data: the data to store in the db.
     * Stores the data in the db.
     * data should contain:
     * - the id of the poi (if it's an update, for create, leave empty or ommmit)
     * - the name of the poi
     * - the location.
     * - device: id of device.
     * - duration
     * - time
     */
    async execute(pluginData, connectionInfo, data){
        return this.postData(pluginData, connectionInfo, data);
    }

    /** store data in the connection (can be different then executing it?)
     @param data {Object} the data to process, should contain the following fields:
     * - device: string
     * - field: name of the field for wich the device has sent historical data
     * - data: the value to store.
     * @param plugins {Object} ref to the plugin manager
     * @param connectionInfo: {Object} connection record
     */
    async postData(plugins, connectionInfo, data){

        let self = this;

        await self.connect(plugins, connectionInfo);                                       //make certain that we have an open connection
        try{
            await self.add(connectionInfo, data);
        }
        finally {
            await self.close();                                           //make certain that the connection is closed again.
        }
    }

    /** store data in the connection (can be different then executing it?)
     @param filter an object used to filter the data.
     * @param plugins {Object} ref to the plugin manager
     * @param connectionInfo: {Object} connection record
     */
    async getData(plugins, connectionInfo, filter){

        let self = this;

        let result = null;
        await self.connect(plugins, connectionInfo);                                       //make certain that we have an open connection
        try{
            result = await self.query(connectionInfo.content, filter);
        }
        finally {
            await self.close();                                           //make certain that the connection is closed again.
        }
        return result;
    }

    /** store data in the connection (can be different then executing it?)
     @param data {Object} the data to process
     * @param plugins {Object} ref to the plugin manager
     * @param connectionInfo: {Object} connection record
     */
    async updateData(plugins, connectionInfo, data){

        let self = this;

        await self.connect(plugins, connectionInfo);                                       //make certain that we have an open connection
        try{
            await self.update(connectionInfo, data);
        }
        finally {
            await self.close();                                           //make certain that the connection is closed again.
        }
    }

    /** store data in the connection (can be different then executing it?)
     @param id {string} the id of the record to delete
     * @param plugins {Object} ref to the plugin manager
     * @param connectionInfo: {Object} connection record
     */
    async deleteData(plugins, connectionInfo, id){

        let self = this;

        await self.connect(plugins, connectionInfo);                                       //make certain that we have an open connection
        try{
            await self.delete(connectionInfo, id);
        }
        finally {
            await self.close();                                           //make certain that the connection is closed again.
        }
    }
	
	/** store data in the connection (can be different then executing it?)
      @param filter an object used to filter the data. The object can contain the following fields:
     * -  from: date
     * - to: date
     * - source: id of connection that stored the data  (ex: source = particle.io connection) .
     * - device: unique identifier (within the source) for the device
     * - field: unique identifier of field within device (optional)
     * - page
     * - pagesize
	 * @param plugins {Object} ref to the plugin manager
     * @param connectionInfo: {Object} connection record
	*/
	async getTimerange(plugins, connectionInfo, filter){
		
		let self = this;

		let result = null;
        await self.connect(plugins, connectionInfo);                                       //make certain that we have an open connection
        try{
            result = await self.getTimerangeHistory(connectionInfo.content, filter);
        }
        finally {
            await self.close();                                           //make certain that the connection is closed again.
        }
		return result;
	}
	

    /**
     * stores the data in the db.
     * @param connectionInfo {object} the connection definition reocord.
     * @param data: the data to store in the db.
     * @returns {Promise}
     */
    async add(connectionInfo, data){
		
		let self = this;
        return new Promise((resolve, reject) => {
            if(!this.con)
                reject("connection not opened");
            if(typeof data.data === "string")
                var sql = "INSERT INTO " + connectionInfo.content.tableName + " (time, site, source, device, field, data) VALUES ('"
                    + data.timestamp + "', '"
                    + connectionInfo.site + "', '"
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
	
	/**
     * updates the record in the db.
     * @param connectionInfo {object} the connection definition reocord.
     * @param data: the data to store in the db.
     * @returns {Promise}
     */
    async update(connectionInfo, data){
		
		let self = this;
        return new Promise((resolve, reject) => {
            if(!this.con)
                reject("connection not opened");
			let sql = null;
			sql = "UPDATE " + connectionInfo.content.tableName + " (set ";
			let needsComma = false;
			if( 'time' in data){
				sql += "time = '" + + data.published_at + "'";
				needsComma = true;
			}
			if( 'device' in data){
				if (needsComma == true) sql += ", ";
				sql += "device = '" + data.coreid + "'";
				needsComma = true;
			}
			if( 'field' in data){
				if (needsComma == true) sql += ", ";
				sql += "field = '" + data.event + "'";
				needsComma = true;
			}
			if( 'data' in data){
				if (needsComma == true) sql += ", ";
				sql += "data = " + JSON.stringify(data.data);
				needsComma = true;
			}
			if(sql){
				self.con.query(sql, function (err, result, fields) {
					if (err) {
						winston.log("error", 'store historical data failed', err);
						reject(err);
					}
					else {
						winston.log("info", 'historical data saved', result);
						resolve(result);
					}
				});
			}
			else{
				winston.log("warn", 'nothing to store', data);
				resolve(null);
			}
        });
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
    async query(connectionInfo, filter){
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
	
	async getTimerangeHistory(connectionInfo, filter){
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
}


//required for all plugins. returns information about the plugin
let getPluginConfig = function (){
    return {
        name: "my_sql_historical_data",
        category: "connection",
        title: "My sql historical data",
        description: "a connection to your mysql database for the historical data of your devices from other connections",
        author: "DeeBobo",
        version: "0.0.1",
        icon: "https://www.mysql.com/common/logos/logo-mysql-170x115.png",
        license: "GPL-3.0",
        requires: {"mysql": "^2.13.0"},
        config:{
            partial: "my_sql_historical_data_config_partial.html",
            code: ["my_sql_historical_data_config_controller.js"]
        },
        create: function(){ return new MySqlHistoricalData();}
    };
};

module.exports = {getPluginConfig: getPluginConfig};