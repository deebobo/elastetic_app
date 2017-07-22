/**
 * Created by Deebobo.dev on 26/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const winston = require('winston');

/**
 * check if the user is allowed to access resources from the specified site. If so, return an access token (jwt)
 * The access token is returned as a cookie on the res parameter.
 * @param res {object} the express-object that receives the result value of the api call
 * @param plugins {object} the server-side plugins object
 * @param site {string} the name of he site.
 * @param name {string} the name of the user.
 * @param pwd {string} the password of the user.
 * @returns {Promise.<void>}
 */
module.exports.login = async function(res, plugins, site, name, pwd){
	
	try{
		let db = plugins.db;

		let siteRec = await db.sites.find(site);
		if(! siteRec) {
            res.status(404).json({message: "unknown site, can't login"});
            return;
        }

		let user = await db.users.findByNameOrEmail(name, site);
		if( ! user )
			res.status(401).json({message:"invalid name or password."});

		if(user.accountState == 'verified'){
			if(user.checkPassword(pwd)) {
				res.cookie("jwt", user.generateJwt());            //return the token as a cookie, this is more secure to store it client side
				res.json({message: "ok"});
			} else {
				res.status(401).json({message:"invalid name or passowrd"});
			}
		}
		else if (user.accountState == 'created'){
			res.status(401).json({message:"account not verified"});
		}
		else {
			res.status(401).json({message:"password was reset"});
		}
	}
    catch(err){
        res.status(500).json({message:err.message});
    }
};

/**
 * Checks if the resource can be accessed by one of the specfied groups and store the result in the res object.
 * If the group has admin rights, then
 * If the resource does not grant access, an error result is attached to the res object.
 * @param resource {list} a list  of allowed groups ( this list contains objects, not j ust ids) for the resource.s
 * @param groups {list} a list of groups that is requesting access to the resource.
 * * @param res {object} optional, express result objects
 * @returns {bool} True if the resource grants access.
 */
module.exports.allowed = function(resource, groups, res){
    try{
    	for(let i = 0; i < groups.length; i++){
        let item = groups[i];											//need to use counter  into array, cause otherwise we iterate over every property of the array as wel, which we don't want.
            if( item.level == 'admin')
                return true;
        	if (resource.find((el) => el._id == item._id) !== -1)
        		return true;
		}
		if(res)
        	res.status(401).json({message:"resource does not allow access"});
		return false;
    }
    catch(err){
    	if(res)
        	res.status(500).json({message:err.message});
        return false;												//something went wrong, can't allow access.
    }
};

/**
 * Checks if a resource can perform a write operation (admin or editor).
 * If the resource does not grant access, an error result is attached to the res object.
 * @param resource {list} a list  of allowed groups for the resource.s
 * @param groups {list} a list of groups that is requesting access to the resource.
 * * @param res {object} optional, express result objects
 * @returns {bool} True if the resource grants access.
 */
module.exports.canWrite = function(groups){
    try{
        //todo: implement this.
        winston.log('error', "to be implemnted");
        return true;
    }
    catch(err){
        if(res)
            res.status(500).json({message:err.message});
        return false;												//something went wrong, can't allow access.
    }
};