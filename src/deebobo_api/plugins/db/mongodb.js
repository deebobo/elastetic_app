/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Debobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const config = require.main.require('./config').config;
const mongoose = require('mongoose');
const winston = require('winston');

/** provides a db connection with a mongo database
* @class  MongoDb
*/
class MongoDb{
    /**create the object
	* @name .constructor()
    * @constructor
	*/
    constructor (){
        this.db = null;
        this.users = null;
        this.groups = null;
        mongoose.Promise = global.Promise;
    }

    /**create a connection with the database.
	* @name .constructor()
    * @constructor
	* @return {Promise}] a promise to perform async operations with.
	*/
    connect(){
		return mongoose.connect(config.db_connection_string);
    }

	/**
   * Indicates whether there is a current and ready-to-use mongoose connection.
   *
   * @name .isConnected()
   * @return {boolean}
   * @api public
   */
    isConnected() {
        return this.db && this.db.readyState === 1;
    }


	/**
    * creates the database, with the users collection. The main admin is
    * added to the users collection.
    *
    * @name .createDb()
    */
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

	/**
    * adds a user to the db
    *
    * @name .addUser()
	* @param {Object} `user` - details about the user.
	* @return {Promise}] a promise to perform async operations with.
    */
    addUser(user){
        user = new this.users(user);
        return user.save(); 
		//(err) =>{
        //    if(err)
        //        throw new Error('failed to create user: ' + admin.name);
        //    else
        //        winston.log('error', 'succesfully create user: ', admin.name);
        //});
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