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
     * @name .addUser()
     * @param {Object} `user` - details about the user.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    addUser(user){
        let record = new this._users(user);
        return record.save();
    }
}

module.exports = Users;
