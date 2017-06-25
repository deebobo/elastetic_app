/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */


class Sites{

    /**
     * @constructor
     * @param collection {object} a reference to the mongo collection that represents the sites
     */
    constructor(collection){
        this._sites = collection;
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
     * @name .add()
     * @param {Object} 'site' see add for more details
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    update(site){
        return this._sites.findOneAndUpdate({"_id": site._id}, site).exec();
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