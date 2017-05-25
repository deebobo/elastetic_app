/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const config = require.main.require('../config').config;
const mongoose = require('mongoose');
const winston = require('winston');
const usersModel = require.main.require('../plugins/models/mongo_users');
const groupsModel = require.main.require('../plugins/models/mongo_groups');
const clientsModel = require.main.require('../plugins/models/mongo_clients');
const accessTokensModel = require.main.require('../plugins/models/mongo_access_tokens');
const refreshTokensModel = require.main.require('../plugins/models/mongo_refresh_tokens');
const crypto = require('crypto');

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
        this.clients = null;
        this.accessTokens = null;
        this.refreshTokens = null;
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
        this._createGroups();
        this._createUsers();
        this._createClients();
        this._createAccessTokens();
    }

    /**
     * creates the collection that stores the user information.
     * @name ._createUsers()
     * @private
     */
    _createUsers(){
        let usersSchema = new mongoose.Schema({
            name: {type: String, required: true},
            email: {type: String, required: true},
            hashedPassword: {type: String, required: true},
            salt: {type: String, required: true},
            site: {type: String, required: true},
            create: {type: Date, default: Date.now()},
            group: {type: String, ref: 'groups'}
        });
        usersSchema.methods.encryptPassword = function(password) {
            return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            //more secure – return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
        };
        usersSchema.virtual('userId').get(function () {
            return this.id;
        });
        usersSchema.virtual('password')
            .set(function(password) {
                this._plainPassword = password;
                this.salt = crypto.randomBytes(32).toString('hex');
                //more secure - this.salt = crypto.randomBytes(128).toString('hex');
                this.hashedPassword = this.encryptPassword(password);
            })
            .get(function() { return this._plainPassword; });
        usersSchema.methods.checkPassword = function(password) {
            return this.encryptPassword(password) === this.hashedPassword;
        };
        usersSchema.index({ email: 1, site: 1}, {unique: true});        //make certain that email + site is unique in the system.
        this.users = new usersModel(mongoose.model('users', usersSchema));
    }

    /**
     * creates the collection that stores information regarding all the clients that can connect to the system.
     * @name ._createClients()
     * @private
     */
    _createClients(){
        let clientSchema = new mongoose.Schema({
            name: { type: String,  unique: true, required: true },
            clientId: {type: String, unique: true, required: true },
            clientSecret: {type: String, required: true}
        });
        this.clients = new clientsModel(mongoose.model('clients', clientSchema));
    }

    /**
     * creates the collection that stores the access tokens.
     * @name ._createAccessTokens()
     * @private
     */
    _createAccessTokens(){
        let accessTokenSchema = new mongoose.Schema({
            userId: { type: String, required: true },
            clientId: { type: String, required: true},
            token: { type: String, unique: true, required: true},
            created: {type: Date, default: Date.now }
        });
        this.accessTokens = new accessTokensModel(mongoose.model('AccessTokens', accessTokenSchema));
    }

    _createsRefreshTokens(){
        let refreshTokenSchema = new Schema({
            userId: {type: String, required: true},
            clientId: {type: String, required: true},
            token: {type: String, unique: true, required: true},
            created: {type: Date, default: Date.now}
        });
        this.refreshTokens = new refreshTokensModel(mongoose.model('refreshTokens', refreshTokenSchema));

    }

    /**
     * creates the collection that stores the group (authorisation) information
     * @name ._createGroups()
     * @private
     */
    _createGroups(){
        let groupsSchema = new mongoose.Schema({
            name: {type: String },
            site: String,
            level: {type: String, enum: ['admin', 'edit', 'view', 'public']}
        });
        groupsSchema.index({ name: 1, site: 1}, {unique: true});        //make certain that email + site is unique in the system.
        this.groups = new groupsModel(mongoose.model('groups', groupsSchema));
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