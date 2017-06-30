/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */


class Groups{

    /**
     * @constructor
     * @param collection {object} a reference to the mongo collection that represents the groups
     */
    constructor(collection){
        this._groups = collection;
    }

	/**
     * adds a group to the db
     *
     * @param {Object} `group` details about the group. The object should contain the following fields:
	 *	- name: the name of the group. 
	 * 	- site: the site to which the group belongs
	 * 	- level: the level of access for the group
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    add(group){
        let grp = new this._groups(group);
        return grp.save();
    }
	
	/**
     * updates a group
     *
     * @name .update()
     * @param {Object} `group` see add for more details
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    update(group){
        return this._users.findOneAndUpdate({"_id": group._id}, group).exec();
    }

	/** Returns all the groups for a particular site.
	* @param {string} `site` The name of the site to list the groups for.
	* @return {Promise}] a promise to perform async operations with. The result of the promise is the list of groups
	*/
    list(site){
        let query = this._groups.find({site: site});
        return query.exec();
    }
	
	/** Returns all the groups for a particular site.
	* @param {string} `site` The name of the site to list the groups for.
	* @param {string} `level` The name of the level that the groups need to belong too..
	* @return {Promise}] a promise to perform async operations with. The result of the promise is the list of groups
	*/
    listForLevel(site, level){
        let query = this._groups.find({site: site, level: level});
        return query.exec();
    }
}

module.exports = Groups;