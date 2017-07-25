/**
 * Created by Deebobo.dev on 22/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const jwt = require('jsonwebtoken');
const config = require.main.require('../api/libs/config');

/**
 * creates a new token
 * @param db: the db to add it to
 * @param resourceType {String} the type of resource(function, connection)
 * @param resourceId {String} the id of the resource
 * @param site {String} the name of the site to create it for.
 * @returns {Promise.<void>}
 */
module.exports.createToken = async function(db, resourceType, resourceId, site){

    let token = await jwt.sign({ isUserToken: false, resourceType: resourceType,  resourceId: resourceId, site: site}, config.config.security.secret);
    let rec = {resourceType: resourceType, resourceId: resourceId.toString(), site: site, token: token};

    return db.tokens.add(rec);
};


/**
 * generates a new token for the specified record.
 * @param db {Object}: the db to use
 * @param token {Object} currently stored token record.
 * @returns {Promise.<*>}
 */
module.exports.newToken = async function(db, token){

    let newtoken = jwt.sign({ isUserToken: false, resourceType: token.resourceType,  resourceId: token.resourceId, site: token.site}, config.config.security.secret);
    token.token = newtoken;
    let data = await db.tokens.update(rec);
    return data;
};