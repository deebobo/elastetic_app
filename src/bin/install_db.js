/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const pluginMan = require('../plugin_manager');
const prompt = require('prompt');                        //ask the user some questions.
const config = require.main.require('../api/libs/config');
const winston = require('winston');
const sitesLib = require.main.require('../api/libs/sites');


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

{
    let def = require(file);
    def.site = "_common";
    try{
        await db.plugins.add(def);
        winston.log("info", "succesfully installed plugin", file);
    }
    catch(err){
        winston.log("errro", "failed to instal plugin", file);
    }
}

{
    winston.log("info", "installing plugins...");
}

async function install(result)
{
	let db = plugins.db;
	config.config.db = result.db;
	try{
		await db.connect();
		winston.log('info', 'succesfully connected to db');
	}
	catch(err){
		winston.log('error', 'failed to connect db:', err);
	}
	try{
        db.createDb();
    }
    catch(err){
        winston.log('error', 'failed to create users:', err);
    }
	try{
        await sitesLib.create(db, 'main', result.name, result.email, result.password);
        await config.save();
        winston.log('info', 'done');
	}
	catch(err){
		winston.log('error', 'failed to populate db with initial values:', err);
	}
    process.exit();
}


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
        install(result);
    }
);

