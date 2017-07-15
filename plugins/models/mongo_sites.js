/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/**@ignore */ 
const mongoose = require('mongoose');

class Sites{

    /**
     * @constructor
     * creates the collection that stores the site information
     * required fields:
     *  - id: the name of the group
     *  - mailhandler: name of the plugin that handles sending email
     *  - contactEmail: the email address of the person that created the site (admin)
     * 	- allowRegistration: determines if users can register on this site or only through invitation.
     * 	- viewGroup: provides quick reference to the default 'view' group for registering new users. This values is assigned
     *    to newly created users as their initial group.
     *  - createdOn: date of record creation
     */
    constructor(){
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
        this._sites = mongoose.model('sites', sitesSchema);
    }

	/**
     * adds a site to the db
     *
     * @param {Object} `group` details about the group. The object should contain the following fields:
	 *	- id: the name of the site. 
	 *  - contactEmail: the email address of the person that created the site (admin)
	 * 	- allowRegistration: determines if users can register on this site or only through invitation.
	 * 	- viewGroup: provides quick reference to the default 'view' group for registering new users.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    add(site){
        let rec = new this._sites(site);
        return rec.save();
    }

    /**
     * updates a site definition
     *
     * @name .update()
     * @param {Object} 'site' see add for more details
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    update(site){
        return this._sites.findOneAndUpdate({"_id": site._id}, site).exec();
    }

    /**
     * updates the mailhandler for the site.
     *
     * @name .updatemailHandler()
     * @param {string} 'siteId' id of site
     * @param {String} 'value' id of of the mailhandler plugin
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    updatemailHandler(siteId, value){
        return this._sites.findOneAndUpdate({"_id": siteId}, {mailHandler: value}).exec();
    }

	/**
     * finds a single site by it's name
     *
     * @param name {string}  - name of the site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    find(name){
        return this._sites.findOne({_id: name}).exec();
    }

	/** Get a list of all the available lists (that can be listed).
	* @return {Promise}] a promise to perform async operations with. The result of the promise is the list of sites
	*/
    list(){
        let query = this._sites.find();
        return query.exec();
    }
}

module.exports = Sites;