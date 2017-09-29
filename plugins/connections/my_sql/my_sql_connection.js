/**
 * Created by elastetic.dev on 4/07/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const mysql = require('mysql');
const winston = require('winston');
const Connection = require.main.require('../plugins/base_classes/connection');

/**
 * base class for all plugins that work with a my sql database.
 */
class MySqlConnection extends Connection {

    constructor(){
        super();
        this.con = null;
    }

    /**
     * initiate the connection using the specified connection information.
     * @param connectionInfo
     * @param dbCreated {bool} true if the db is already created and the connect can specify the db name.
     */
    async connect(plugins, connectionInfo){
        let self = this;
        let dbConnection = await plugins.db.connections.find(connectionInfo.content.dbConnection, connectionInfo.site);
        if(dbConnection){
            let connectionInfo = dbConnection.content;
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
        else{
            winston.log("error", "failed to find connection:", connectionInfo.name, "site:", connectionInfo.site)
        }
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
	
	/** builds a query based on the filter/grouping definition and returns the result.
	*  This is the common implementation for all my_sql tables.
	*/
	async getReport(plugins, connectionInfo, filter){
		let self = this;

        let result = null;
        await self.connect(plugins, connectionInfo);                                       //make certain that we have an open connection
        try{
            result = await self.report(connectionInfo.content, filter);
        }
        finally {
            await self.close();                                           //make certain that the connection is closed again.
        }
        return result;
	}
	
	async report(connection, queryDef){
		let self = this;
        return new Promise((resolve, reject) => {
            if(this.con){
				let params = [];
                let sql = "SELECT " + self._buildReportFields(queryDef) + 
				          " from " + connection.tableName + 
						  self._buildReportWhere(queryDef, params) + 
						  self._buildReportGroupBy(queryDef) +
						  self._buildReportSort(queryDef);
                self.con.query(sql, params, function (err, result, fields) {
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
	
	static _buildReportFields(queryDef){
		let result = "";
		let first = true;
		for(let i = 0; i < queryDef.fields.length; i++){
			
			if(!first)
				result += ", ";
			else
				first = false;
			
			let field = queryDef.fields[i];
			if("calculate" in field)
				result += field.calculate + "(" + field + ")";
			else
				result += field;
		}
		return result;
	}
	
	static _buildReportWhere(queryDef, params){
		let result = "";
		let first = true;
		for(let i = 0; i < queryDef.filter.length; i++){
			
			if(!first)
				result += ", ";
			else
				first = false;
			
			let field = queryDef.filter[i];
			params.push(field.value);
			result += field.name + " = ?";
		}
		if(result.length > 0)
            result = " WHERE " + result;
		
        if('page' in queryDef && queryDef.page){
            let pagesize = 50;
            if('pagesize' in queryDef && queryDef.pagesize)
                pagesize = parseInt(queryDef.pagesize);

            res += ' LIMIT ' + (parseInt(queryDef.page) * pagesize).toString() + ', ' + pagesize.toString();
        }
		return result;
	}
	
	static _buildReportGroupBy(queryDef){
		let result = "";
		let first = true;
		for(let i = 0; i < queryDef.groupby.length; i++){
			
			if(!first)
				result += ", ";
			else
				first = false;
			result += queryDef.groupby[i];
		}
		if(result.length > 0)
            result = " GROUP BY " + result;
		return result;
	}
	
	static _buildReportSort(queryDef){
		let result = "";
		let first = true;
		for(let i = 0; i < queryDef.orderby.length; i++){
			
			if(!first)
				result += ", ";
			else
				first = false;
			
			let field = queryDef.orderby[i];
			if("direction" in field){
				if(field.direction.toLowerCase() == "asc")
					result += field.value + " ASC";
				else
					result += field.value + " DESC";
			}
			else
				result += field;
		}
		if(result.length > 0)
            result = " ORDER BY " + result;
		return result;
	}
}

module.exports = MySqlConnection;