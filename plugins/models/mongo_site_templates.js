/**
 * Created by elastetic.dev on 25/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/**@ignore */ 
const mongoose = require('mongoose');

/**
 * @class represents the collection of site templates
 */
class SiteTemplates{

    /**
     * @constructor
     * creates a collection or table that allows a plugin to store site template definitions
     */
    constructor(){
        let siteTemplatesSchema = new mongoose.Schema({
            name: String,															//name of the template
            description: String,
            author: String,
            version: String,
            icon: String,											//uri to small icon 
			image: String,											//uri to bigger image 
            definition: Object,
            createdOn:{type: Date, default: Date.now()}
        });
        siteTemplatesSchema.index({ name: 1}, {unique: true});        //fast access at name & site level
        this._templates = mongoose.model('siteTemplates', siteTemplatesSchema);
    }

    /**
     * adds a template to the db
     *
     * @name .add()
     * @param {Object} `template` details about the user. The object should contain the following fields:
     *	- name: the name of the template.
     * 	- site: the site on which the email template was created
     *	- subject: subject line
     * 	- subject: html body
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    add(template){
        let record = new this._templates(template);
        return record.save();
    }

    /**
     * updates an site template
     *
     * @name .update()
     * @param {Object} `template` details about the email template. See add for more info
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    update(template){
        return this._templates.findOneAndUpdate({"_id": template._id}, template).exec();
    }

    /** Get a list of all the available templates for a site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the list of plugins
     */
    list(){
        let query = this._templates.find();
        return query.exec();
    }

    /**
     * finds a template
     *
     * @name .find()
     * @param value {string}  - name or email of the user.
     * @param site {string}  - name of the site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    find(name){
        return this._templates.findOne( { name: name } ).exec();
    }
}

module.exports = SiteTemplates;
