/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const config = require.main.require('../api/libs/config').config;

const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;


async function initPassport(app, passport){
    let db = await app.get('plugins');
    db = db.db;

    let cookieExtractor = function(req) {                       //we store the key as a cookie, this is more secure for storing locally on client.
        let token = null;
        if (req && req.cookies) token = req.cookies['jwt'];
        return token;
    };

    let options = {
        passReqToCallback: true,                        // default false
        jwtFromRequest: cookieExtractor,
        secretOrKey: config.security.secret
    };


    passport.use(new JwtStrategy(options,
        async function(req, payload, done) {
            try{
                let user = await db.users.find(payload.id);
                if (!user) { return done(null, false); }
                done(null, user);
            }
            catch (err) {
                return done(err, false);
            }
        }
    ));

    app.use(passport.initialize());
}

module.exports = initPassport;