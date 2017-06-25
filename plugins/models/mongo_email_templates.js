/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/**
 * @class represents the collection of email templates
 */
class EmailTemplates{

    /**
     * @constructor
     * @param collection {object} a reference to the mongo collection that represents the users
     */
    constructor(collection){
        this._templates = collection;
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
     * updates an email template
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
    list(site){
        let query = this._templates.find({site: site});
        return query.exec();
    }

	/**
     * finds a user by name or email for a specific site.
     *
     * @name .find()
     * @param value {string}  - name or email of the user.
	 * @param site {string}  - name of the site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    find(name, site){
        return this._templates.findOne( { name: value, site: site } ).exec();
    }
}

module.exports = EmailTemplates;
