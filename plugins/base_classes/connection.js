/**
 * Created by elastetic.dev on 19/08/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const tokens = require.main.require('../api/libs/tokens');

"use strict";


/**
 * base class for connections
 *
 * descendents can add the following functions, which are supported by the system, but are not required:
 * - async destroy(plugins, oldRec): called when the connection has been deleted and removed from the db.
 * - async create(connectionInfo) create the connection
 */
class Connection {

    constructor() {

    }

    /**
     * creates an authentication token for callbacks.
     * @param plugins
     * @param connection
     * @returns {Promise.<void>}
     */
    async createCallbackToken(plugins, connection){
        connection.content.authToken = await tokens.createCallbackToken("connection", connection._id, connection.site);
    }

}

module.exports = Connection;