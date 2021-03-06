/**
 * Created by elastetic.dev on 25/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
 
/**@ignore */ 
const mongoose = require('mongoose');

class Pages{

    /**
     * @constructor
     * creates the collection that stores all the pages for each site.
     * required fields:
     *  - name: the name of the page
     * 	- site: the site to which this group applies
     *  - content: the content of the page
     *  - groups: the groups that have access to this page.
     *  - partial: the index nr of the partial from the plugin that is the main entry point.
     *  - controller: name of a controller to be used by this page. Can be defined in the plugin or a globaly available controller.
     *  - createdOn: date of record creation
     */
    constructor(){
        let pagesSchema = new mongoose.Schema({
            name: String,                                        		//the email address of the person that created the site (admin)
            site: String,
            plugin:  {type: mongoose.Schema.Types.ObjectId, ref: 'plugins'},
            controller: String,                                         //name of a controller to be used by this page. Can be defined in the plugin or a globaly available controller.
            partial: Number,                                            //the index nr of the partial from the plugin that is the main entry point.
            data: Object,                                               //data for the plugin.
            groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'groups'}],
            createdOn:{type: Date, default: Date.now()}
        });
        pagesSchema.index({ name: 1, site: 1}, {unique: true});        //make certain that email + site is unique in the system.
        this._pages = mongoose.model('pages', pagesSchema);
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
        if('_id' in page)
            return this._connections.findOneAndUpdate({"_id": page._id}, page).exec();
        else
            return this._connections.findOneAndUpdate({"name": page.name, 'site': page.site}, page).exec();
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
     * finds a page by it's id.
     *
     * @param id {string}  - id of the page.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    findById(id){
        return this._pages.findOne( { _id: id } ).populate('plugin').populate('groups').exec();
    }
	
	/**
     * removes a page.
     *
     * @name .delete()
     * @param id {String}  - the id of the object that needs to be deleted.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    deleteById(id){
        return this._pages.findOneAndRemove( { _id: id } ).exec();
    }

    /**
     * removes a page.
     *
     * @name .delete()
     * @param name {String}  - the name of the object that needs to be deleted.
     * @param site {string}  - name of the site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    delete(name, site){
        return this._pages.findOneAndRemove( { name: name, site: site } ).exec();
    }
}

module.exports = Pages;