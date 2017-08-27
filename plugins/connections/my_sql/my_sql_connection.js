/**
 * Created by Deebobo.dev on 4/07/2017.
 * copyright 2017 Deebobo.dev
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
        let dbConnection = await plugins.db.connections.findById(connectionInfo.content.dbConnection);
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

}



module.exports = MySqlConnection;