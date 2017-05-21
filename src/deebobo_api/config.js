/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Debobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const fs = require('fs');
const winston = require('winston');

//create the config object and provide default values.
let config = {
    db: 'mongodb',
    db_connection_string: 'mongodb://localhost/deebobo'
};

//loads the config data from file
function load(){
    let data = fs.readFileSync('./config.json');
    try{
        config = JSON.parse(data);
        winston.log("info", 'succesfully loaded config from disk', config);
    }
    catch(err){
        winston.log("error", 'failed to load config data from disk');
    }
}

//saves the config data to file
function save(){
    let data = JSON.stringify(myOptions);
    fs.writeFile('./config.json', data, function (err) {
        if (err) {
            winston.log("error", 'failed to save config data to disk: ', err.message, config);
            return;
        }
        winston.log("info", 'succesfully saved config to disk', config);
    });
}

module.exports = {
    config: config,
    load: load,
    save: save
};