/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/**
 * @class represents the users collection
 */
class Clients{

    /**
     * @constructor
     * @param collection {object} a reference to the mongo collection that represents the clients
     */
    constructor(collection){
        this._clients = collection;
    }

    /**
     * finds a single client by id
     *
     * @name .findById()
     * @param {string} `id` - details about the user.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    findById(id){
        return this._clients.findOne({clientId: id}).exec();
    }
}

module.exports = Clients;
