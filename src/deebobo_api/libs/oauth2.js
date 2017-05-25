/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const oauth2orize = require('oauth2orize');
const passport = require('passport');
const crypto = require('crypto');
const config = require.main.require('../config').config;

async function initOauth(app) {
    let db = await app.get('plugins');
    db = db.db;

    function updateTokens(user, client){
        db.refreshTokens.deleteForUserClient(user.userId, client.clientId);
        db.accessTokens.deleteForUserClient(user.userId, client.clientId);
        let tokenValue = crypto.randomBytes(32).toString('hex');
        let refreshTokenValue = crypto.randomBytes(32).toString('hex');
        db.accessTokens.add(tokenValue, user.userId, client.clientId);
        db.refreshTokens.add(refreshTokenValue, user.userId, client.clientId);
        //let info = { scope: '*' };
        return [tokenValue, refreshTokenValue];
    }

    let server = oauth2orize.createServer();        // create OAuth 2.0 server

    // Exchange username & password for an access token.
    server.exchange(oauth2orize.exchange.password(async function(client, username, password, scope, done) {
        try{
            let user = await db.users.findByName(username);
            if (!user)
                return done(null, false);
            if (!user.checkPassword(password))
                return done(null, false);
            let tokens = updateTokens(user, client);
            done(null, tokens[0], tokens[1], { 'expires_in':config.security.tokenLife });
        }
        catch(err){
            return done(err);
        }
    }));


    // Exchange refreshToken for an access token.
    server.exchange(oauth2orize.exchange.refreshToken(async function(client, refreshToken, scope, done) {
        try{
            let token = db.refreshTokens.find(refreshToken);
            if (!token)
                return done(null, false);
            let user = await db.users.find(token.userId);
            if (!user)
                return done(null, false);
            let tokens = updateTokens(user, client);
            done(null, tokens[0], tokens[1], { 'expires_in': config.security.tokenLife });
        }
        catch(err){
            return done(err);
        }
    }));

    return[
        passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
        server.token(),
        server.errorHandler()
    ];
}