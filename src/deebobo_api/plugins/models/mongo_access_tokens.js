/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/**
 * @class represents the users collection
 */
class AccessTokens{

    /**
     * @constructor
     * @param collection {object} a reference to the mongo collection that represents the access tokens
     */
    constructor(collection){
        this._tokens = collection;
    }

    /**
     * finds a single record by token
     *
     * @name .find()
     * @param {string} `accessToken` - details about the user.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    find(accessToken){
        return this._tokens.findOne({token: accessToken}).exec();
    }

    /**
     * removes a record from the collection, based on the token
     * @name .delete()
     * @param accessToken {string} - the token to delete
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    delete(accessToken) {
        return this._tokens.remove({token: accessToken}).exec();
    }

    /**
     * removes all records from the collection, for the user and the specified client.
     * @name .deleteForUserClient()
     * @param userId {String} - id of the user
     * @param clientId {String} - if of the client
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    deleteForUserClient(userId, clientId){
        return this._tokens.remove({userId: userId, clientId: clientId}).exec();
    }

    /**
     * adds a new record to the collection, for the user and the specified client.
     * @name .add()
     * @param tokenValue {String} - value for the token
     * @param userId {String} - id of the user
     * @param clientId {String} - if of the client
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    add(tokenValue, userId, clientId){
        let record = new this._tokens({ token: tokenValue, clientId: clientId, userId: userId });
        return record.save();
    }

}

module.exports = AccessTokens;
