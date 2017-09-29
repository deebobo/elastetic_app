/**
 * Created by elastetic.dev on 18/08/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const mysql = require('mysql');
const winston = require('winston');
const MySqlConnection = require.main.require('../plugins/connections/my_sql/my_sql_connection');


/**
 * stores point of interest data in an sql db.
 */
class MySqlPOIDataStore extends MySqlConnection{

    constructor(){
        super();
    }

    /**
     * called when a connection is created.
     * Makes certain that the db and table exist (if need be)
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
        let result = null;
        await self.connect(plugins, connectionInfo);                                       //make certain that we have an open connection
        try{
            result = await self.add(connectionInfo, data);
        }
        finally {
            await self.close();                                           //make certain that the connection is closed again.
        }
        return result;
    }

    /** get data from the connection
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

    /** Get last value for the connection
     * @param device {string} id of the device
     * @time {number} timestamp to be close to.
     * @param plugins {Object} ref to the plugin manager
     * @param connectionInfo: {Object} connection record
     */
    async getLastestData(plugins, connectionInfo, device){

        let self = this;

        let result = null;
        await self.connect(plugins, connectionInfo);                                       //make certain that we have an open connection
        try{
            result = await self.getLatest(connectionInfo.content, device);
        }
        finally {
            await self.close();                                           //make certain that the connection is closed again.
        }
        return result;
    }

    /** Get last value for the connection
     @param filter an object used to filter the data.
     * @param plugins {Object} ref to the plugin manager
     * @param connectionInfo: {Object} connection record
     */
    async getNearestData(plugins, connectionInfo, device, lat, lng){

        let self = this;

        let result = null;
        await self.connect(plugins, connectionInfo);                                       //make certain that we have an open connection
        try{
            result = await self.getNearest(connectionInfo.content, device, lat, lng);
        }
        finally {
            await self.close();                                           //make certain that the connection is closed again.
        }
        return result;
    }

    async getTempPoint(plugins, connectionInfo, device){

        let self = this;

        let result = null;
        await self.connect(plugins, connectionInfo);                                       //make certain that we have an open connection
        try{
            result = await self.getTempPointInternal(connectionInfo.content, device);
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
    async updateData(plugins, connectionInfo, record, data){

        let self = this;
        let result = null;
        await self.connect(plugins, connectionInfo);                                       //make certain that we have an open connection
        try{
            result = await self.update(connectionInfo, record, data);
        }
        finally {
            await self.close();                                           //make certain that the connection is closed again.
        }
        return result;
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

    /**
     * called when a connection is created (after connect is called, so the db is already connected).
     * Makes certain that the db and table exist (if need be)
     *
     * table fields
     * - site: string: name of the site/application that owns the data.
     * - source: id of connection that stored the data  (ex: source = particle.io connection) .
     * - lat, lng: coordinates of the point of iterest
     * - name: name of the point of interest.
	 * - count: the nr of times that the POI has been found
	 * - duration: amount of time spent on same poi, expressed in seconds
	 * - time: last time that point was visited
     * - radius: the size of the poi, expressed in meters. Default is 15
     */
    async create(connectionInfo){
        let self = this;
        return new Promise((resolve, reject) => {
            if(self.con){

                try{
                    if(connectionInfo.content.createTable){
                        var sql = "CREATE TABLE " + connectionInfo.content.tableName + " (id int NOT NULL PRIMARY KEY AUTO_INCREMENT, time datetime, site VARCHAR(255), source VARCHAR(255), device VARCHAR(255), name VARCHAR(255), lat DOUBLE, lng DOUBLE, count int DEFAULT 0, duration int DEFAULT 0, blacklisted bool DEFAULT false, radius int DEFAULT 20, temp bool DEFAULT false   )";
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
	
	async getLatest(connection, device){
		let self = this;
        return new Promise((resolve, reject) => {
            if(this.con){
                let sql = "SELECT * from " + connection.tableName + ' WHERE device = ? AND blacklisted = false ORDER BY time DESC LIMIT 1';
                let params = [device];
                self.con.query(sql, params, function (err, result) {
                    if (err) {
                        reject(err);
                        winston.log("error", 'table query failed', sql);
                    }
                    else {
                        if(result.length > 0)
                            resolve(result[0]);
                        else
                            resolve(null);
                    }
                });
            }
            else
                reject("connection is not opened")
        });
	}

    async getTempPointInternal(connection, device){
        let self = this;
        return new Promise((resolve, reject) => {
            if(this.con){
                let sql = "SELECT * from " + connection.tableName + ' WHERE device = ? AND blacklisted = false AND temp = true ORDER BY time DESC LIMIT 1';
                let params = [device];
                self.con.query(sql, params, function (err, result) {
                    if (err) {
                        reject(err);
                        winston.log("error", 'table query failed', sql);
                    }
                    else {
                        if(result.length > 0)
                            resolve(result[0]);
                        else
                            resolve(null);
                    }
                });
            }
            else
                reject("connection is not opened")
        });
    }

	
	async getNearest(connection, device, lat, lng){
		let self = this;
        return new Promise((resolve, reject) => {
            if(this.con){
                let sql = "SELECT *, ABS(" + lat + " - lat) + ABS(" + lng + " - lng) as distance from " + connection.tableName + ' WHERE (device = ? OR device = NULL) AND blacklisted = false ORDER BY distance LIMIT 10';
                let params = [device];
                self.con.query(sql, params, function (err, result) {
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
     * stores the data in the db.
     * @param connectionInfo {object} the connection definition reocord.
     * @param data: the data to store in the db.
     * * data should contain:
     * - the id of the poi (if it's an update, for create, leave empty or ommmit)
     * - the name of the poi
     * - lat
	 * - lng
     * - device: id of device.
	 * - blacklisted
     * @returns {Promise}
     */
    async store(connectionInfo, data){

        let self = this;
        return new Promise((resolve, reject) => {
            if(!this.con)
                reject("connection not opened");
            let sql = null;
            let params = [];
            if('id' in data){
                sql = "UPDATE " + connectionInfo.content.tableName + " set ";
                if( 'lat' in data){
                    sql += "lat = ?";
                    params.push(data.lat);
                }
				if( 'lng' in data){
					if (params.length >  0)
                        sql += ", ";
                    sql += "lng = ?";
                    params.push(data.lng);
                }
                if( 'name' in data) {
                    if (params.length >  0)
                        sql += ", ";
                    sql +=  "name = ?";
                    params.push(data.name);
                }
				if( 'count' in data) {
                    if (params.length >  0)
                        sql += ", ";
                    sql +=  "count = ?";
                    params.push(data.count);
                }
				if( 'time' in data) {
                    if (params.length >  0)
                        sql += ", ";
                    sql +=  "time = ?";
                    params.push(data.time);
                }
				if( 'duration' in data) {
                    if (params.length >  0)
                        sql += ", ";
                    sql +=  "duration = ?";
                    params.push(data.duration);
                }
				if( 'blacklisted' in data) {
                    if (params.length >  0)
                        sql += ", ";
                    sql +=  "blacklisted = ?";
                    params.push(data.blacklisted);
                }
                if( 'temp' in data) {
                    if (params.length >  0)
                        sql += ", ";
                    sql +=  "temp = ?";
                    params.push(data.temp);
                }
                sql += " WHERE id = ?";
				params.push(data.id);
            }
            else {
                sql = "INSERT INTO " + connectionInfo.content.tableName +
                    " SET site = ?, source = ?, device = ?, lat = ?, lng = ?, count = ?, duration = ?, time = ?, blacklisted = false, name = ?, temp = ?";
                if(! data.count) data.count = 0;
                if(! data.duration) data.duration = 0;
                if(! data.name) data.name = "new point";
                if(! ("temp" in data)) data.temp = false;
                let time = null;
                if('time' in data)
                    time = data.time;
                else
                    time = new Date(Date.now()).toISOString();
                params = [connectionInfo.site, connectionInfo.name, data.device, data.lat, data.lng, data.count, data.duration, time, data.name, data.temp];
            }
            self.con.query(sql, params, function (err, result) {
                if (err) {
                    reject(err);
                    winston.log("error", 'store poi data failed', err);
                }
                else {
                    if('insertId' in result && result.inserId != 0)
                        data.id = result.insertId;
                    resolve(data);
                    winston.log("info", 'poi data saved', data, result);
                }
            });
        });
    }

    async add(connectionInfo, data){
        return this.store(connectionInfo, data);
    }

    /**
     * updates the record
     * @param connectionInfo
     * @param data {object} fields:
     * - id: string
     * - device: string
     * - field: name of the field for wich the device has sent historical data
     * - data: the value to store.
     * @returns {Promise.<void>}
     */
    async update(connectionInfo, record, data){
        data.id = record;
        return this.store(connectionInfo, data);
    }
	
	/**
     * deletes the record from the db.
     * @param connectionInfo {object} the connection definition reocord.
     * @param id {string} id of record to delete
     * @returns {Promise}
     */
    async delete(connectionInfo, id){

        let self = this;
        return new Promise((resolve, reject) => {
            if(!this.con)
                reject("connection not opened");
            let sql = "DELETE from " + connectionInfo.content.tableName + " WHERE id = ?";
			let params = [id];
            
            self.con.query(sql, params, function (err, result, fields) {
                if (err) {
                    reject(err);
                    winston.log("error", 'store poi data failed', err);
                }
                else {
                    resolve(result);
                    winston.log("info", 'poi data saved', result);
                }
            });
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
        if('count' in filter && filter.count)
            res += (res.length > 0 ? ' and ' : '') + 'count = ' + filter.count;
        if('duration' in filter && filter.duration)
            res += (res.length > 0 ? ' and ' : '') + 'duration = ' + filter.duration;
		if('blacklisted' in filter && filter.blacklisted)
            res += (res.length > 0 ? ' and ' : '') + 'blacklisted = ' + filter.blacklisted;
		else
			res += (res.length > 0 ? ' and ' : '') + 'blacklisted = false';
        if('temp' in filter && filter.temp)
            res += (res.length > 0 ? ' and ' : '') + 'temp = ' + filter.temp;
        else
            res += (res.length > 0 ? ' and ' : '') + 'temp = false';

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
     * query the connection for data.
     * @param filter an object used to filter the data. The object can contain the following fields:
     * - from: date
     * - to: date
     * - source: id of connection that stored the data  (ex: source = particle.io connection) .
     * - device: unique identifier (within the source) for the device
     * - count: the nr of times poi has been visited
	 * - duration: the total duration spend in a poi
     * - page
     * - pagesize
     */
    async query(connectionInfo, filter){
        let self = this;
        return new Promise((resolve, reject) => {
            if(this.con){
                var sql = "SELECT id, time, device, source, name, lat, lng,count, duration from " + connectionInfo.tableName + self._buildWhere(filter);
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
        name: "my_sql_poi_data",
        category: "connection",
        title: "My sql POI data store",
        description: "a connection to your mysql database for the poi data calculated by a poi calculator function",
        author: "elastetic",
        version: "0.0.1",
        icon: "https://www.mysql.com/common/logos/logo-mysql-170x115.png",
        license: "GPL-3.0",
        requires: {"mysql": "^2.13.0"},
        config:{
            partial: "my_sql_poi_data_config_partial.html",
            code: ["my_sql_poi_data_config_controller.js"]
        },
        create: function(){ return new MySqlPOIDataStore();}
    };
};

module.exports = {getPluginConfig: getPluginConfig};