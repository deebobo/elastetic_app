/**
 * Created by Deebobo.dev on 26/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const pluginLib = require.main.require('../api/libs/plugins');
const winston = require('winston');

/* GET all plugins for current site. 
 for file upload: https://howtonode.org/really-simple-file-uploads
 */
module.exports.get = async function (req, res, next) {
    try {
        let db = await req.app.get('plugins');
        db = db.db;
        let recs = await db.plugins.list(req.params.site);
        res.json(recs);
    }
    catch (err) {
        res.status(400).json({message: err});
    }
};

/* GET all plugins for current site. 
 for file upload: https://howtonode.org/really-simple-file-uploads
 */
module.exports.getForType = async function (req, res, next) {
    try {
        let db = await req.app.get('plugins');
        db = db.db;
        plugins = await db.plugins.listForType(req.params.site, req.params.type, true);
        res.json(plugins);
    }
    catch (err) {
        res.status(400).json({message: err});
    }
};

module.exports.getDefaultforType = async function (req, res){
	try {
		if(req.params.type == 'mail'){
			let plugins = await req.app.get('plugins');
			let plugin = await plugins.getMailHandlerFor(req.params.site);
			res.json(plugin);
		}
		else{
			res.status(400).json({message: 'plugin has no known default'});
		}
    }
    catch (err) {
        res.status(500).json({message: err});
    }
}

module.exports.setDefaultforType = async function (req, res){
	try {
		if(req.params.type == 'mail'){
			let plugins = await req.app.get('plugins');
			let db = plugins.db;
			await db.sites.updatemailHandler(req.params.site, req.body);
			res.json(plugins);
		}
		else{
			res.status(400).json({message: 'plugin has no known default'});
		}
    }
    catch (err) {
        res.status(500).json({message: err});
    }
}

/* add a new plugin. */
module.exports.post = async function (req, res, next) {
    try {
        let pluginRec = null;
        if (req.files.hasOwnProperty(plugin)) {
            if(req.body.hasOwnProperty('global') && req.body.global == true)
                pluginRec = pluginLib.install(req.files.plugin);			            //no site -> global installation; req.files.plugin -> plugin is the fieldname of the form
            else
                pluginRec = pluginLib.install(req.files.plugin, req.params.site);		//installs for specific site only.
        }
        else if (req.files.hasOwnProperty(serverplugin)) {
            if (req.params.site == "main")
                pluginRec = pluginLib.serverInstall(req.files.serverplugin, req.params.site);     //install as a server  plugin, only allowed from server.
            else
                res.status(401).json({message: "not allowed from this site"});
        }
        else
            res.status(403).json({message: "file upload not supported"});
        if (pluginRec) {
            let db = await req.app.get('plugins');
            db = db.db;
            pluginRec.site = req.params.site;
            await db.plugins.add(pluginRec);
            res.status(200).json(pluginRec);
        }
    }
    catch (err) {
        res.status(400).json({message: err});
    }
};

/* upgrade or change a plugin. */
module.exports.put = async function (req, res, next) {
    winston.log("info", "to be implemented");
}


/* uninstall a plugin. */
module.exports.delete = async function (req, res) {
    try {
        if (pluginLib.uninstall(req.params.site, req.body.name)) {			;			//req.files.plugin -> plugin is the fieldname of the form
			let db = await req.app.get('plugins');
            db = db.db;
            await db.plugins.delete(req.body.name, req.params.site);
            res.status(200).json({"mesage": 'ok'});
        }
    }
    catch (err) {
        res.status(400).json({message: err});
    }
}
 