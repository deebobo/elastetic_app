/**
 * Created by elastetic.dev on 25/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
 
/**@ignore */ 
const mongoose = require('mongoose');

class views{

    /**
     * @constructor
     * @param collection {object} a reference to the mongo collection that represents the views
     */
    constructor(collection){
        let viewSchema = new mongoose.Schema({
            name: String,															//name of the template
            site: String,
            plugin: {type: mongoose.Schema.Types.ObjectId, ref: 'plugins'},
            controller: String,                                         //name of a controller to be used by this view. Can be defined in the plugin or a globaly available controller.
            partial: Number,                                            //the index nr of the partial from the plugin that is the main entry point.
			data: Object,                                               //extra data for the view.
			groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'groups'}],
            createdOn:{type: Date, default: Date.now()}
        });
        viewSchema.index({ name: 1, site: 1}, {unique: true});        //fast access at name & site level
        this._views = mongoose.model('views', viewSchema);
    }

	/**
     * adds a view to the db
     *
     * @param {Object} `view` details about the view. The object should contain the following fields:
	 *	- name: the name of the group. 
	 * 	- site: the site to which the group belongs
	 *  - plugin: ref to the plugin that needs to be used
	 *  - partial: nr of the partial to use as main
	 *  - controller: the name of the controller to use.
	 *  - groups: the groups for this view to determine the access.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    add(view){
        let record = new this._views(view);
        return record.save();
    }
	
	/**
     * updates a view definition 
     *
     * @name .update()
     * @param {Object} `view` see add for more info
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    update(view){
        if('_id' in view)
            return this._connections.findOneAndUpdate({"_id": view._id}, view).exec();
        else
            return this._connections.findOneAndUpdate({"name": view.name, 'site': view.site}, view).exec();

    }

	/** Returns all the views for a particular site, without the actual content.
		fields returned:
		- name
		- id
		- createdOn
		- groups
	* @param {string} `site` The name of the site to list the groups for.
	* @return {Promise}] a promise to perform async operations with. The result of the promise is the list of groups
	*/
    list(site){
        let query = this._views.find({site: site}, 'name createdOn groups');
        return query.exec();
    }
	
	/**
     * finds a view by it's  id.
     *
     * @param id {string}  - id of the view.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    find(id){
        return this._views.findOne( { _id: id } ).populate('plugin').populate('groups').exec();
    }
	
	/**
     * finds a view by name for a specific site.
     *
     * @name .find()
     * @param value {string}  - name of the view.
	 * @param site {string}  - name of the site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    findByName(name, site){
        return this._views.findOne( { name: name, site: site } ).populate('plugin').populate('groups').exec();
    }
	
	/**
     * removes a view.
     *
     * @name .delete()
     * @param id {String}  - the id of the object that needs to be deleted.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    delete(id){
        return this._views.findOneAndRemove( { _id: id } ).exec();
    }

    /**
     * removes a view.
     *
     * @name .delete()
     * @param value {string}  - name of the view.
     * @param site {string}  - name of the site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    delete(name, site){
        return this._views.findOneAndRemove( { name: name, site: site } ).exec();
    }
}

module.exports = views;