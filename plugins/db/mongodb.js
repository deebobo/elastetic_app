/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

 /**
 @ignore
 */
const config = require.main.require('../api/libs/config');
const mongoose = require('mongoose');
const winston = require('winston');
const usersModel = require.main.require('../plugins/models/mongo_users');
const groupsModel = require.main.require('../plugins/models/mongo_groups');
const sitesModel = require.main.require('../plugins/models/mongo_sites');
const pagesModel = require.main.require('../plugins/models/mongo_pages');
const viewsModel = require.main.require('../plugins/models/mongo_views');
const siteCollectionModel = require.main.require('../plugins/models/mongo_site_collection');
const emailTemplatesModel = require.main.require('../plugins/models/mongo_email_templates');
const pluginsModel = require.main.require('../plugins/models/mongo_plugins');
const connectionsModel = require.main.require('../plugins/models/mongo_connections');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

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
		this.pluginSiteData = null;
		this.emailTemplates = null;
		this.plugins = null;
		this.connections = null;
		this.views = null;
        mongoose.Promise = global.Promise;
    }

    /**
	create a connection with the database.  The objects should retrieve connection information from config.js (found in the root of the api).
	* @return {Promise} a promise to perform async operations with.
	*/
    connect(){
        return mongoose.connect(config.config.db_connection_string);
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
		this._createPluginSiteData();
		this._createEmailTemplates();
		this.plugins = new pluginsModel();
		this.connections = new connectionsModel();
		this.views = new viewsModel();
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
			accountState: {type: String, enum: ['created', 'verified', 'pwdReset'], default: 'created'},	//current state of the account, so we know if verification is needed or pwd has been reset
			verificationToken: String,																		//if verification or pwd reset is needed, this field is filled in.
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
            expiry.setDate(expiry.getDate() + config.config.security.expires);
            try {
                return jwt.sign({
                    id: this._id,
                    email: this.email,
                    name: this.name,
					site: this.site,
                    exp: parseInt(expiry.getTime() / 1000),
                }, config.config.security.secret);
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
    * creates a collection or table that allows a plugin to store data at the level of a site (each site gets 1 record per plugin).
	* example: this can be used by an emailer plugin to store configurations that relate to the site that wants to use the plugin.
	* @return {Promise}] a promise to perform async operations with. The result of the promise is the model that represents the db collection.
    */
	_createPluginSiteData(){
		let pluginSiteDataSchema = new mongoose.Schema({
            site: String,
			plugin: String,
			data: Object,											//the data for the site.
            createdOn:{type: Date, default: Date.now()}
        });
		pluginSiteDataSchema.index({ name: 1, site: 1}, {unique: true});        //make certain that email + site is unique in the system.
        this.pluginSiteData = new siteCollectionModel(mongoose.model('pluginSiteData', pluginSiteDataSchema));
	}
	
	/**
    * creates a collection or table that allows a plugin to store data at the level of a site (each site gets 1 record per plugin).
	* example: this can be used by an emailer plugin to store configurations that relate to the site that wants to use the plugin.
	*/
	_createEmailTemplates(){
		let emailTemplatesSchema = new mongoose.Schema({
			name: String,															//name of the template
            site: String,
			subject: String,
			body: String,
            createdOn:{type: Date, default: Date.now()}
        });
		emailTemplatesSchema.index({ name: 1, site: 1}, {unique: true});        //fast access at name & site level
        this.emailTemplates = new emailTemplatesModel(mongoose.model('emailTemplates', emailTemplatesSchema));
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
	 *  - mailhandler: name of the plugin that handles sending email
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
			title: String,												//titelf for the site
            contactEmail: String,                                       //the email address of the person that created the site (admin)
            allowRegistration: {type: Boolean, default: true},          //determines if users can register on this site or only through invitation.
			mailHandler: {type: String},
			requestEmailConfirmation: {type: Boolean, default: true},	//when true, newly registered users have to confirm their email address by clicking on a link found in a mail (if the email template exists).
			sendHelloEmail: {type: Boolean, default: true},				//when true, a hello email is sent to newly registered users (if the email template exists)
            viewGroup: {type: mongoose.Schema.Types.ObjectId, ref: 'groups'},                   //provides quick reference to the default 'view' group for registering new users.
            homepage:  String,                                                                  //the name of the page to use as homepage. Don't need an object id, cause that is usually not yet created if the site is not yet there. But site + page name is uniuqe, so can easiliy search on this.
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
     *  - partial: the index nr of the partial from the plugin that is the main entry point.
     *  - controller: name of a controller to be used by this page. Can be defined in the plugin or a globaly available controller.
	 *  - createdOn: date of record creation 
     * @private
     */
    _createPages(){
        let pagesSchema = new mongoose.Schema({
            name: String,                                        		//the email address of the person that created the site (admin)
			site: String,
			plugin:  {type: mongoose.Schema.Types.ObjectId, ref: 'plugins'},
            controller: String,                                         //name of a controller to be used by this page. Can be defined in the plugin or a globaly available controller.
            partial: Number,                                            //the index nr of the partial from the plugin that is the main entry point.
			groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'groups'}],
            createdOn:{type: Date, default: Date.now()}
        });
		pagesSchema.index({ name: 1, site: 1}, {unique: true});        //make certain that email + site is unique in the system.
        this.pages = new pagesModel(mongoose.model('pages', pagesSchema));
    }
}

//required for all plugins. returns information about the plugin
let getPluginConfig = function (){
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
};

module.exports = {getPluginConfig: getPluginConfig};