/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/**
 * @class represents the users collection
 */
class Users{

    /**
     * @constructor
     * @param collection {object} a reference to the mongo collection that represents the users
     */
    constructor(collection){
        this._users = collection;
    }

    /**
     * adds a user to the db
     *
     * @name .add()
     * @param {Object} `user` details about the user. The object should contain the following fields:
	 *	- name: the name of the user. 
	 *	- email: the email address of the admin user
	 *	- password: the password for the user.
	 * 	- site: the site to which the user has access
	 * 	- group: the group to which this user belongs
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    add(user){
        let record = new this._users(user);
        return record.save();
    }

    /**
     * finds a single record by id
     * populates the groups list, so it can easily be searched for (editor levels and such, for authorisation)
     * @name .find()
     * @param id {string}  - id of the user record.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    find(id){
        return this._users.findOne({_id: id}).populate('groups').exec();
    }

	/**
     * finds a user by name or email for a specific site.
     * populates the groups list, so it can easily be searched for (editor levels and such, for authorisation)
     * @name .find()
     * @param value {string}  - name or email of the user.
	 * @param site {string}  - name of the site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    findByNameOrEmail(value, site){
        return this._users.findOne( { $or: [{ name: value, site: site }, {email: value, site: site}]} ).populate('groups').exec();
    }
	
	/** adds a user to the specified group
	 * @param user {string}  - id of the user.
	 * @param group {string}  - id of the group.
	*/
	addGroup(user, group){
		return this._users.findByIdAndUpdate(user,
											{$push: {"groups": group}},
											{safe: true, upsert: true, new : true});
	}
	
	/** removes the user from the specified group
	 * @param user {string}  - id of the user.
	 * @param group {string}  - id of the group.
	*/
	removeGroup(user, group){
		return this._users.findByIdAndUpdate(user, {$pullAll: {"groups": group}});
	}
}

module.exports = Users;
