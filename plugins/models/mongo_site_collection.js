/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/** a collection that stores data for a plugin at the level of a site.
*/
class SiteDataCollection{

    /**
     * @constructor
     * @param collection {object} a reference to the mongo collection that represents the groups
     */
    constructor(collection){
        this._collection = collection;
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
        let rec = new this._collection(record);
        return rec.save();
    }
	
	/** Returns the plugin data for a particular site and plugin.
	* @param {string} `site` The name of the site to list the plugin data for.
	* @param {string} `plugin` The name of the plugin retrive data for.
	* @return {Promise}] a promise to perform async operations with. The result of the promise is the data record
	*/
	get(plugin, site){
		return this._users.findOne({site: site, plugin: plugin}).exec();
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