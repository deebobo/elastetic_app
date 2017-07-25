/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/**@ignore */ 
const mongoose = require('mongoose');

/** a collection that stores data for a plugin at the level of a site.
*/
class SiteDataCollection{

    /**
     * @constructor
     * creates a collection or table that allows a plugin to store data at the level of a site (each site gets 1 record per plugin).
     * example: this can be used by an emailer plugin to store configurations that relate to the site that wants to use the plugin.
     */
    constructor(){
        let pluginSiteDataSchema = new mongoose.Schema({
            site: String,
            plugin: String,
            data: Object,											//the data for the site.
            createdOn:{type: Date, default: Date.now()}
        });
        pluginSiteDataSchema.index({ name: 1, site: 1}, {unique: true});        //make certain that email + site is unique in the system.
        this._collection = mongoose.model('pluginSiteData', pluginSiteDataSchema);
    }

	/**
     * adds a record to the collection.
     *
     * @param {Object} `group` details about the group. The object should contain the following fields:
	 * 	- site: the site to which the group belongs
	 * 	- data: a json object with the actual data for the plugin.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    add(record){
        let result = new this._collection(record);
        return result.save();
    }

    /**
     * updates the record in the db
     *
     * @name .update()
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    update(record){
        return this._collection.findOneAndUpdate({"site": record.site, "plugin": record.plugin}, record).exec();
    }
	
	/** Returns the plugin data for a particular site and plugin.
	* @param {string} `site` The name of the site to list the plugin data for.
	* @param {string} `plugin` The name of the plugin retrive data for.
	* @return {Promise}] a promise to perform async operations with. The result of the promise is the data record
	*/
	get(site, plugin){
		return this._collection.findOne({site: site, plugin: plugin}).exec();
	}

	/** Returns all the plugin data for a particular site.
	* @param {string} `site` The name of the site to list the plugin data for.
	* @return {Promise}] a promise to perform async operations with. The result of the promise is the list of records
	*/
    list(site){
        let query = this._collection.find({site: site});
        return query.exec();
    }
}

module.exports = SiteDataCollection;