/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const mongoose = require('mongoose');

class Plugins{

    /**
     * @constructor
     * creates the collection that stores all the pages for each site.
     * required fields:
     *  - name: the name of the page
     * 	- site: the site to which this group applies
     * 	- description: a description of the plugin.
     *  - client:   (if the plugin is a client plugin)
     *      - partial: the name and location of the partial that should be used for this plugin (if it's a client side plugin)
     *      - code: the code files that should be loaded for this plugin.
     *  - config:
     *    - partial: he name and location of the partial that should be used to configure this plugin
     *    - code: the code files that should be loaded for this plugin.
     *  - installedOn: date of record creation
     *  - type: "mail', 'page', 'view'
     *  - version: the version of the plugin that is installed.
     *  - author: the creator of the plugin
     * @private
     */
    constructor(){
        let angularSchema = new mongoose.Schema({
            partials: [String],
            scripts: [String],
            css: [String],
            load: [String]
        });
        let pluginSchema = new mongoose.Schema({
            name: String,                                        		//the email address of the person that created the site (admin)
            description: String,
            site: String,
            type: String,
            version: String,
            author: String,
            client: angularSchema,
            config: angularSchema,
            installedOn:{type: Date, default: Date.now()}
        });
        pluginSchema.index({ name: 1, site: 1}, {unique: true});        //make certain that email + site is unique in the system.
        this._plugins = mongoose.model('plugins', pluginSchema);
    }

	/**
     * adds a site to the db
     *
     * @param {Object} `plugin` details about the group. The object should contain the following fields:
	 *	- id: the name of the site. 
	 *  - contactEmail: the email address of the person that created the site (admin)
	 * 	- allowRegistration: determines if users can register on this site or only through invitation.
	 * 	- viewGroup: provides quick reference to the default 'view' group for registering new users.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    add(plugin){
        let rec = new this._plugins(plugin);
        return rec.save();
    }
	
	/**
     * adds a plugins with the specified name on the specified site
     *
     * @param {String} `name` the name of the plugin
	 * @param {String} `site` the name of the site
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was deleted
     */
    delete(name, site){
        return this._plugins.remove( { name: value, site: site } ).exec();
    }


	/** Get a list of all the available plugins for a site.
	* @return {Promise}] a promise to perform async operations with. The result of the promise is the list of plugins
	*/
    list(site){
        let query = this._plugins.find({site: site});
        return query.exec();
    }
	
	/** Get a list of all the available plugins for a site of a particular type.
	* @return {Promise}] a promise to perform async operations with. The result of the promise is the list of plugins
	*/
    listForType(site, type, includeCommon = false){
        let query = null;
        if(includeCommon)
            query = this._plugins.find({site: {$in: [site, '_common']} , type: type});
        else
            query = this._plugins.find({site: site, type: type});
        return query.exec();
    }

	
	/**
     * finds a plugin by name for a specific site.
     *
     * @name .find()
     * @param value {string}  - name of the plugin.
	 * @param site {string}  - name of the site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    find(name, site){
        return this._plugins.findOne( { name: name, site: site } ).exec();
    }
}

module.exports = Plugins;