/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

 /**
 @ignore
 */
const config = require.main.require('../api/libs/config').config;
const mongoose = require('mongoose');
const winston = require('winston');
const usersModel = require.main.require('../plugins/models/mongo_users');
const groupsModel = require.main.require('../plugins/models/mongo_groups');
const sitesModel = require.main.require('../plugins/models/mongo_sites');
const pagesModel = require.main.require('../plugins/models/mongo_pages');
const crypto = require('crypto');
var jwt = require('jsonwebtoken');

/** provides a db connection with a mongo database  
*/
class MongoDb{
    /**create the object
	* This function is called with the new operator to create an object that represents the database. The function shouldn't do much more but set up an empty, not connected database.
    * @constructor
	*/
    constructor (){
        this.db = null;
        this.users = null;
        this.groups = null;
        this.sites = null;
		this.pages = null;
        mongoose.Promise = global.Promise;
    }

    /**
	create a connection with the database.  The objects should retrieve connection information from config.js (found in the root of the api).
	* @return {Promise} a promise to perform async operations with.
	*/
    connect(){
        return mongoose.connect(config.db_connection_string);
    }

	/**
   * Indicates whether there is a current and ready-to-use mongoose connection.
   *
   * @return {boolean}
   */
    isConnected() {
        return this.db && this.db.readyState === 1;
    }


	/**
    * create the database with all the required collections/tables: 
	* - [groups]()
    */
    createDb(){
        this._createGroups();
        this._createUsers();
        this._createSites();
		this._createPages();
    }

    /**
     * creates the collection that stores the user information.
	 * 	- fields:
	 *		- name: the name of the admin user. 
	 *		- email: the email address of the admin user
	 *		- hashedPassword: a hash value of the password for the user.
	 * 		- salt: encryption token
	 * 		- site: the site to which the user has access
	 *  	- createdOn: date of record creation 
	 * 		- group: the group to which this user belongs
	 * 	- virtual fields:
	 *		- password: when set, calculate salt and hashedPassword
	 * 	- keys: 
	 * 		- (unique) email - site
	 *		- (unique) name - site
     * @private
     */
    _createUsers(){
        let usersSchema = new mongoose.Schema({
            name: {type: String, required: true},
            email: {type: String, required: true},
            hashedPassword: {type: String, required: true},
            salt: {type: String, required: true},
            site: {type: String, required: true},
            createdOn: {type: Date, default: Date.now()},
            groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'groups'}]
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

        usersSchema.methods.generateJwt = function() {
            let expiry = new Date();
            expiry.setDate(expiry.getDate() + config.security.expires);
            try {
                return jwt.sign({
                    id: this._id,
                    email: this.email,
                    name: this.name,
                    exp: parseInt(expiry.getTime() / 1000),
                }, config.security.secret);
            }
            catch (err){
                winston.log("error", err);
                return null;
            }
        };

        usersSchema.index({ email: 1, site: 1}, {unique: true});        //make certain that email + site is unique in the system.
        usersSchema.index({ name: 1, site: 1}, {unique: true});        //make certain that name + site is unique in the system.
        this.users = new usersModel(mongoose.model('users', usersSchema));
    }


    /**
     * creates the collection that stores the group (authorisation) information
	 * required fields:
	 *  - name: the name of the group
	 * 	- site: the site to which this group applies
	 *  - level: the level of access that this group has. Can be one of the following values:
	 *  	- admin: full access
	 *		- edit: can edit views
	 *		- view: can see views
	 *		- public: items authorized with this view are publicly accessible.
	 * 	- keys: 
	 *		- (unique) name - site
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

    /**
     * creates the collection that stores the site information
	 * required fields:
	 *  - id: the name of the group
	 *  - contactEmail: the email address of the person that created the site (admin)
	 * 	- allowRegistration: determines if users can register on this site or only through invitation.
	 * 	- viewGroup: provides quick reference to the default 'view' group for registering new users. This values is assigned
	 *    to newly created users as their initial group.
	 *  - createdOn: date of record creation 
     * @private
     */
    _createSites(){
        let sitesSchema = new mongoose.Schema({
            _id: {type: String},
            contactEmail: String,                                        //the email address of the person that created the site (admin)
            allowRegistration: {type: Boolean, default: true},          //determines if users can register on this site or only through invitation.
            viewGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'groups'},                   //provides quick reference to the default 'view' group for registering new users.
            createdOn:{type: Date, default: Date.now()}
        });
        sitesSchema.virtual('name').get(function() {                                            //convenience function, so we also have the field 'name
            return this._id;
        });
        this.sites = new sitesModel(mongoose.model('sites', sitesSchema));
    }
	
	/**
     * creates the collection that stores all the pages for each site.
	 * required fields:
	 *  - name: the name of the page
	 * 	- site: the site to which this group applies
	 *  - content: the content of the page
	 *  - groups: the groups that have access to this page.
	 *  - createdOn: date of record creation 
     * @private
     */
    _createPages(){
        let pagesSchema = new mongoose.Schema({
            name: String,                                        		//the email address of the person that created the site (admin)
			site: String,
			groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'groups'}],
            createdOn:{type: Date, default: Date.now()}
        });
		pagesSchema.index({ name: 1, site: 1}, {unique: true});        //make certain that email + site is unique in the system.
        this.pages = new pagesModel(mongoose.model('pages', pagesSchema));
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