/**
 * Created by Deebobo.dev on 26/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
 
const auth = require.main.require('../api/libs/auth');

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
            let db = await req.app.get('plugins');
            db = db.db;

            let site = await db.sites.find(req.params.site);
            if(! site)
                res.status(404).json({message:"unknown site, can't register"});
            else if(site.allowRegistration === false)
                res.status(403).json({message:"This is a private site, registration is only allowed upon invitation"});
            else{
                let user = await db.users.findByNameOrEmail(req.body.name, req.params.site);
                if( ! user ) {
                    let user = { name: req.body.name, email: req.body.email, password: req.body.password, site: req.params.site, groups: [site.viewGroup]};
                    db.users.add(user);
                    res.status(200).json({message: "ok"});
                }
                else if (user.name === name) {
                    res.status(403).json({message:"name is already used"});
                }
                else
                    res.status(403).json({message:"email is already registered"});
            }
        }
        catch(err){
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

