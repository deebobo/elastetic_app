/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */


class Pages{

    /**
     * @constructor
     * @param collection {object} a reference to the mongo collection that represents the pages
     */
    constructor(collection){
        this._pages = collection;
    }

	/**
     * adds a page to the db
     *
     * @param {Object} `page` details about the page. The object should contain the following fields:
	 *	- name: the name of the group. 
	 * 	- site: the site to which the group belongs
	 *  - plugin: ref to the plugin that needs to be used
	 *  - partial: nr of the partial to use as main
	 *  - controller: the name of the controller to use.
	 *  - groups: the groups for this page to determine the access.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    add(page){
        let record = new this._pages(page);
        return record.save();
    }
	
	/**
     * updates a page definition 
     *
     * @name .update()
     * @param {Object} `page` see add for more info
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    update(page){
        return this._connections.findOneAndUpdate({"_id": page._id}, page).exec();
    }

	/** Returns all the pages for a particular site, without the actual content.
		fields returned:
		- name
		- id
		- createdOn
		- groups
	* @param {string} `site` The name of the site to list the groups for.
	* @return {Promise}] a promise to perform async operations with. The result of the promise is the list of groups
	*/
    list(site){
        let query = this._pages.find({site: site}, 'name createdOn groups');
        return query.exec();
    }
	
	/**
     * finds a page by name for a specific site.
     *
     * @name .find()
     * @param value {string}  - name of the page.
	 * @param site {string}  - name of the site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    find(name, site){
        return this._pages.findOne( { name: name, site: site } ).populate('plugin').populate('groups').exec();
    }
	
	/**
     * removes a page.
     *
     * @name .delete()
     * @param id {String}  - the id of the object that needs to be deleted.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    delete(id){
        return this._pages.findOneAndRemove( { _id: id } ).exec();
    }
}

module.exports = Pages;