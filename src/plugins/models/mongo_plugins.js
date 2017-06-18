/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */


class Plugins{

    /**
     * @constructor
     * @param collection {object} a reference to the mongo collection that represents the sites
     */
    constructor(collection){
        this._plugins = collection;
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