/**
 * Created by elastetic.dev on 25/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const config = require.main.require('../api/libs/config').config;

const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;


async function initPassport(app, passport){
    let db = await app.get('plugins');
    db = db.db;

    let tokenExtractor = function(req) {                       //we store the key as a cookie, this is more secure for storing locally on client.
        let token = null;
        if (req){
            if(req.cookies && 'jwt' in req.cookies)
                token = req.cookies['jwt'];
            else if(req.headers && 'jwt' in req.headers)
                token = req.headers['jwt'];

        }
        return token;
    };

    let options = {
        passReqToCallback: true,                        // default false
        jwtFromRequest: tokenExtractor,
        secretOrKey: config.security.secret
    };


	/** Check if the user is performing a valid request.
	*/
    passport.use(new JwtStrategy(options,
        async function(req, payload, done) {
            try{
                if(db == null){                                         //in case that the system was not yet installed and is now accessed for the first time
                    db = await app.get('plugins');
                    db = db.db;
                }
                if(db != null) {
                    if(payload.isUserToken){
                        let user = await db.users.find(payload.id);
                        if(req.params.site === undefined && req.originalUrl.startsWith("/api/user/"))    //this type of url is allowed to be called without 'site' param
                            req.params.site = payload.site;
                        if (!user || req.params.site != payload.site)  		//the user must also be allowed to go to the requested site.
                            return done(null, false);
                        done(null, user);
                    }
                    else{
                        if(payload.resourceType == "function"){
                            let func = await db.functions.findById(payload.resourceId);
                            if(!func || req.params.site != payload.site)
                                return done(null, false);
                            done(null, func);
                        }else if(payload.resourceType == "connection"){
                            let connection = await db.connections.findById(payload.resourceId);
                            if(!connection || req.params.site != payload.site)
                                return done(null, false);
                            done(null, connection);
                        }
                    }
                }
                else
                    done("database not loaded", false);
            }
            catch (err) {
                return done(err, false);
            }
        }
    ));

    app.use(passport.initialize());
}

module.exports = initPassport;