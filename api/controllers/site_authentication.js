/**
 * Created by elastetic.dev on 26/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
 
const auth = require.main.require('../api/libs/auth');
const email = require.main.require('../api/libs/email');
const url = require('url');
const jwt = require('jsonwebtoken');
const config = require.main.require('../api/libs/config');
const winston = require('winston');

/**
 * register a new user to a specific site. If the user already exists, the site is added to the list of possible sites.
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
module.exports.register = async function(req, res) {

    req.checkBody('name', 'No valid name is given').notEmpty();
    req.checkBody('password', 'No valid password is given').notEmpty();
    req.checkBody('email', 'No valid email is given').isEmail();

    let errors = req.validationErrors();
    if (errors) {
        res.send(errors, 400);
    } else {
        try{
            let pluginMan = await req.app.get('plugins');
            db = pluginMan.db;

            let site = await db.sites.find(req.params.site);
            if(! site)
                res.status(404).json({message:"unknown site, can't register"});
            else if(site.allowRegistration === false)
                res.status(403).json({message:"This is a private site, registration is only allowed upon invitation"});
            else{
                let userName = await db.users.findByNameOrEmail(req.body.name, req.params.site);
                let userEmail = await db.users.findByNameOrEmail(req.body.email, req.params.site);
                if( ! userName && !userEmail ) {
                    let user = { name: req.body.name, email: req.body.email, password: req.body.password, site: req.params.site, groups: [site.viewGroup]};
                    user = await db.users.add(user);
					if(site.requestEmailConfirmation == true)
						await email.sendEmailWithLink(site, user, pluginMan, url.resolve(req.protocol + '://' + req.get('host'), "api/site/" + req.params.site + '/activate'), "registration confirmation");
					else
						user.accountState = 'verified';
					if(site.sendHelloEmail)
						email.sendMail(site, user,  pluginMan, "welcome");
                    res.status(200).json(user);
                }
                else if (userName) {
                    res.status(403).json({message:"name is already used"});
                }
                else
                    res.status(403).json({message:"email is already registered"});
            }
        }
        catch(err){
            winston.log("error", err);
            res.status(500).json({message:err.message});
        }
    }
};

/**
 * handles login requests.
 * looks up the user by name or email and checks the pwd. If succesful, a token is returned.
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
module.exports.login = async function(req, res){
    if(req.body.name && req.body.password){
		let name = req.body.name;
		let password = req.body.password;

		auth.login(res, await req.app.get('plugins'), req.params.site, name, password);
	}
	else
		res.status(400).json({message:"missing username or password"});
};

function _internalActivate(activationKey, site){
    let decoded = jwt.verify(activationKey, config.config.security.secret);
    if(decoded.site != site)
        return null;
    else{
        return decoded.id;
    }

}

module.exports.activate = async function(req, res){
	try{
		let result = _internalActivate(req.params.activationKey, req.params.site);
		if(result){
            let pluginMan = await req.app.get('plugins');
            let db = pluginMan.db;
            await db.users.updateAccountState(result, "verified");
			res.status(200).json({message:"ok"});
		}
		else
			res.status(400).json({message:result});
	}
	catch(err)
	{
        winston.log("error", err);
		res.status(400).json({message:err});
	}
    //activationKey
};

//sets the account of the user into a pwd reset state and sends an email to the user with a link that contains a new activation key.
module.exports.startResetPwd = async function(req, res){
	if(req.body.name){
		let name = req.body.name;
		let site = req.params.site;
		
		let pluginMan = await req.app.get('plugins');
		let db = pluginMan.db;
		let user = await db.users.findByNameOrEmail(name, site);
		if(user){
			await db.users.updateAccountState(decoded.id, "pwdReset");
			await email.sendEmailWithLink(site, user, pluginMan, url.resolve(req.protocol + '://' + req.get('host'), "site", req.params.site, "resetpwd"), "password reset");
			res.status(200).json({message:"ok"});
		}
		else
			res.status(400).json({message:"unknown user name or email."});
	}
	else
		res.status(400).json({message:"missing username or email"});
};

module.exports.finishResetPwd = async function(req, res){

    req.checkBody('password', 'No valid password is given').notEmpty();
    req.checkBody('token', 'No valid pwd reset token found').notEmpty();

    let errors = req.validationErrors();
    if (errors)
        res.send(errors, 400);
    else{
        let pluginMan = await req.app.get('plugins');
        let db = pluginMan.db;

        try {
            let decoded = jwt.verify(req.body.token, config.security.secret);

            if(decoded.site !== site){
                res.status(400).json({message: "invalid site"});
                return;
            }
            let siteRec = await db.sites.find(site);
            if(! siteRec) {
                res.status(404).json({message: "unknown site, can't login"});
                return;
            }
            let user = await db.users.findById(decoded.id);
            user.password = req.body.password;
            user.accountState = 'verified';
            await db.users.update(user);
        }
        catch(err) {
            res.status(400).json({message: err});
        }

    }

};
