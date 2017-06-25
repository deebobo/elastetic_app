/**
 * Created by Deebobo.dev on 26/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const winston = require('winston');

/* GET all email templates for current site. 
 for file upload: https://howtonode.org/really-simple-file-uploads
 */
module.exports.get = async function (req, res, next) {
    try {
        let db = await req.app.get('plugins');
        db = db.db;
        let recs = await db.emailTemplates.list(req.params.site);
        res.json(recs);
    }
    catch (err) {
        res.status(400).json({message: err});
    }
};


/* add a new template. */
module.exports.post = async function (req, res, next) {
    try {
        let pluginRec = req.body;
        if (pluginRec) {
            let db = await req.app.get('plugins');
            db = db.db;
            pluginRec.site = req.params.site;
            await db.emailTemplates.add(pluginRec);
            res.status(200).json(pluginRec);
        }
    }
    catch (err) {
        res.status(400).json({message: err});
    }
};

/* update a template. */
module.exports.put = async function (req, res, next) {
    try {
        let pluginRec = req.body;
        if (pluginRec) {
            let db = await req.app.get('plugins');
            db = db.db;
            pluginRec.site = req.params.site;
            pluginRec._id = req.params.template;
            await db.emailTemplates.update(pluginRec);
            res.status(200).json(pluginRec);
        }
    }
    catch (err) {
        res.status(400).json({message: err});
    }
}


/* uninstall a plugin. */
module.exports.delete = async function (req, res) {
    try {
        let db = await req.app.get('plugins');
		db = db.db;
		await db.emailTemplates.delete(req.body.name, req.params.site);
		res.status(200).json(pluginRec);
    }
    catch (err) {
        res.status(400).json({message: err});
    }
}
 