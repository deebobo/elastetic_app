/**
 * Created by Deebobo.dev on 26/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const winston = require('winston');


/**
 * create a new site and admin user for that site. If the site name already exists, the operation is illegal.
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
module.exports.register = async function(req, res) {

    req.checkBody('name', 'No valid username is given').notEmpty();
    req.checkBody('password', 'No valid password is given').notEmpty();
    req.checkBody('email', 'No valid email is given').isEmail();
    req.checkBody('site', 'No valid site name is given').isAlphanumeric();

    let errors = req.validationErrors();
    if (errors) {
        res.send(errors, 400);
    } else {
        try{
            let db = await req.app.get('plugins');
            db = db.db;

            let site = await db.sites.find(req.body.site);
            if(site)
                res.status(403).json({message:"site already exists, please choose a different name"});
            else{
                let admins = {name: "admins", site: 'main', level: "admin"};
                let editors = {name: "editors", site: 'main', level: "edit"};
                let viewers = {name: "viewers", site: 'main', level: "view"};
                let viewGrp = await db.groups.add(viewers);
                let adminRec = await db.groups.add(admins);
                db.groups.add(editors);
                db.sites.add({id: req.body.site, viewGroup: viewGrp._id, contactEmail: req.body.email});

                let user = { name: req.body.name, email: req.body.email, password: req.body.password, site: req.body.site, groups: [adminRec._id]};
                db.users.add(user);
                res.status(200);
            }
        }
        catch (err){
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
		
		auth.login(res, await req.app.get('plugins'), req.body.site, name, password);
	}
	else
		res.status(400).json({message:"missing username or password"});
};