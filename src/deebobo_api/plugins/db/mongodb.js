/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Debobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const config = require.main.require('./config').config;
const mongoose = require('mongoose');
const winston = require('winston');

class MongoDb{
    //create the object
    constructor (){
        this.db = null;
        this.users = null;
        this.groups = null;
    }

    //create a connection with the database.
    async connect(){
        try{
            mongoose.Promise = global.Promise;
            this.db = await mongoose.connect(config.db_connection_string);
            winston.log('info', 'succesfully opened db: ', err );
            return true;
        }
        catch(err){
            winston.log('error', 'failed to open db: ', err );
            return false;
        }
    }

    //creates the database, with the users collection. The main admin is
    //added to the users collection.
    createDb(){
        this._createUsers();
        this._createGroups();
    }

    _createUsers(){
        let usersSchema = new mongoose.Schema({
            name: String,
            email: String,
            password: String,
            site: String,
            group: String
        });
        usersSchema.index({ email: 1, site: 1}, {unique: true});        //make certain that email + site is unique in the system.
        this.users = mongoose.model('users', usersSchema);
    }

    _createGroups(){
        let grupsSchema = new mongoose.Schema({
            name: {type: String, unique: true},
            level: {type: String, enum: ['admin', 'edit', 'view', 'public']}
        });
        grupsSchema.index({name: 1});                               //quick search on the name.
        this.groups = mongoose.model('groups', grupsSchema);
    }

    //adds a user to the db
    addUser(user){
        user = new this.users(user);
        user.save( (err) =>{
            if(err)
                throw new Error('failed to create user: ' + admin.name);
            else
                winston.log('error', 'succesfully create user: ', admin.name);
        });
    }
}

//required for all plugins. returns information about the plugin
let getPluginType = function (){
    return {
        name: "mongodb",
        category: "db",
        title: "store the data in a mongo database",
        description: "this is the default database used by deebobo",
        author: "DeeBobo",
        version: "0.0.1",
        icon: "/images/plugin_images/MongoDB_Gray_Logo_FullColor_RGB-01.jpg",
        license: "GPL-3.0",
        create: MongoDb
    };
}

module.exports = {getPluginType: getPluginType};