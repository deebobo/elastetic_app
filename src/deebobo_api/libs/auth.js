/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const config = require.main.require('../config').config;


async function initPassport(app, passport){
    let db = await app.get('plugins');
    db = db.db;

    app.use(passport.initialize());
    passport.use(new BasicStrategy(
        async function(username, password, done) {
            try {
                let client = await db.clients.findById(username);
                if (!client)
                    return done(null, false);
                if (client.clientSecret != password)
                    return done(null, false);
            }
            catch(err){
                return done(err);
            }
        }
    ));

    passport.use(new ClientPasswordStrategy(
        async function(clientId, clientSecret, done) {
            try {
                let client = await db.clients.findById(clientId);
                if (!client)
                    return done(null, false);
                if (client.clientSecret != clientSecret)
                    return done(null, false);
            }
            catch(err){
                return done(err);
            }
        }
    ));

    passport.use(new BearerStrategy(
        async function(accessToken, done) {
            try{
                let token = await db.accessTokens.find(accessToken);
                if (!token) { return done(null, false); }

                if( Math.round((Date.now()-token.created)/1000) > config.security.tokenLife ) {
                    await db.accessTokens.delete(accessToken);
                    return done(null, false, { message: 'Token expired' });
                }

                let user = await db.users.find(token.userId);
                if (!user)
                    return done(null, false, { message: 'Unknown user' });
                let info = { scope: '*' };
                done(null, user, info);
            }
            catch (err) {
                return done(err);
            }
        }
    ));
}

