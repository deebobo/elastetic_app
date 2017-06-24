/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const pluginMan = require('../plugin_manager');
const prompt = require('prompt');                        //ask the user some questions.
const config = require.main.require('../api/libs/config');
const winston = require('winston');
const installer = require.main.require('../api/libs/intall');


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
        installer.install(plugins, result);
        process.exit();
    }
);

