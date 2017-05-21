/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Debobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const pluginMan = require('./plugin_manager');
const prompt = require('prompt');                        //ask the user some questions.
const config = require.main.require('./config');
const winston = require('winston');
const crypto = require('crypto');


//see https://www.npmjs.com/package/prompt for info regarding prompt

//define the questions that need to be asedk to the user while installing the db.
let userQuestions = {
    properties:{
        name:{
            required: true,
            type: 'string',
            default: 'admin',
            description: 'name of the admin user'
        },
        email: {
            required: true,
            type: 'string',
            description: 'email of the admin user'
        },
        password: {
            required: true,
            type: 'string',
            hidden: true,
            description: 'password for the admin user'
        },
        db:{
            required: true,
            type: 'string',
            default: 'mongodb',
            description: 'database type to use'
        },
        dbPath:{
            required: true,
            type: 'string',
            default: 'mongodb://localhost/deebobo',
            description: 'connection string for the database'
        }
    }
};


winston.log('info', 'initializing plugins');

let plugins = new pluginMan();
plugins.initPluginMonitor();

plugins.load();
prompt.start();
prompt.get(userQuestions, (err, result) =>
    {
        if(err){
            winston.log('error', 'invalid command line data received: ', err);
            return;
        }
        let db = plugins.db;
        config.config.db = result.db;
        if(db.connect()){
            db.createDb();
            pwd = crypto.createHash('md5').update(result.password).digest('hex');
            let admin = {name: result.name, email: result.email, password: pwd, site: 'main', group: 'admin'};
            db.addUser(admin);
            config.save();
        }
        winston.log('info', 'done');
    }
);

