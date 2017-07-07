/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/**
 * @fileoverview
 * Global configuration values that are available throughout the application.
 * This icnludes:
 * - the type of database to use
 * - the connection string for the database.
 *
 * Allows for saving and loading the configuration from a json file, called config.json, stored in the root directory
 * of the application.
 */

const fs = require('fs');
const winston = require('winston');

//
/**
 * create the config object and provide default values.
 * @type {{db: string, db_connection_string: string}}
 */
let config = {
    db: '',
    db_connection_string: 'mongodb://localhost/deebobo',
    security:{
        secret: 'IOT4AllWebsitebyDeebobo_plugabletools',
        expires: 20                                             //nr of days that the key is valid.
    },
    port: 4000
};

//loads the config data from file
function load(){
    return new Promise((resolve, reject) =>
        {
            fs.exists('./config.json', function(exists)
            {
                if(exists){                             							//at first run, this file doesn't exist, use defaults instead. In case of heroku or similar, there
                    try {
                        let data = fs.readFileSync('./config.json');
                        module.exports.config = JSON.parse(data);
                        winston.log("info", 'succesfully loaded config from disk', config);
                        resolve();
                    }
                    catch (err) {
                        winston.log("error", 'failed to load config data from disk');
                        reject(err);
                    }
                }
                else{
                    module.exports.config.db = process.env.db;                                  //for heroku and others that cant store files locally
                    module.exports.config.db_connection_string = process.env.MONGODB_URI;
                    module.exports.config.secret = process.env.secret;
                    module.exports.config.expires = process.env.expires;
                    resolve();
                }
            });
        }
    );
}

//saves the config data to file
function save(){
    let data = JSON.stringify(module.exports.config);
    return new Promise((resolve, reject) =>
        {
            fs.writeFile('./config.json', data, function (err) {
                if (err) {
                    winston.log("error", 'failed to save config data to disk: ', err.message, config);
                    reject(err);
                }
                else{
                    winston.log("info", 'succesfully saved config to disk', config);
                    resolve();
                }
            });
        }
    );
}

module.exports = {
    config: config,
    load: load,
    save: save
};