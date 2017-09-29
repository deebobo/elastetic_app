/**
 * Created by elastetic.dev on 3/06/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const sitesLib = require.main.require('../api/libs/sites');
const winston = require('winston');

/**
 * create a new site and admin user for that site. If the site name already exists, the operation is illegal.
 * @param req {object} the request object
 * @param res
 * @returns {Promise.<void>}
 */
module.exports.create = async function(req, res){
    try{
        let plugins = await req.app.get('plugins');
        await sitesLib.create(plugins, req.body, req.protocol + '://' + req.get('host'));
        res.status(200).json({message: 'ok'});
    }
    catch (err){
        winston.log("error", err);
        if(err.name == 'siteExists'){
            res.status(401).json({message:err.message});
            return;
        }

        res.status(500).json({message:err.message});
    }
};

module.exports.listTemplates = async  function(req, res){
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        sites = await db.siteTemplates.list();
        res.json(sites);
    }
    catch (err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/**
 * get the plugins that need to be configured for the specified template
 * for now, simply return all global plugins. The client will do further filtering.
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
module.exports.getTemplateParams = async function(req, res){
    try {
        let db = await req.app.get('plugins');
        db = db.db;
        let recs = await db.plugins.list("_common");
        res.status(200).json(recs);
    }
    catch (err) {
        winston.log("error", err);
        res.status(400).json({message: err});
    }
};

/**
 * get a list of sites registerd at this domain.
 * @param req the input record
 * @param res The result record.
 * @returns {Promise.<void>}
 */
module.exports.list = async function(req, res){
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        sites = await db.sites.list();
        res.json(sites);
    }
    catch (err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/**
 * get the details for a single site.
 * @param req
 * @param res
 * @returns {Promise.<void>}
 */
module.exports.get = async function(req, res){
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        let site = await db.sites.find(req.params.site);
        if (site)
            res.json(site);
        else
            res.status(404).json({message:"unknown site"});
    }
    catch (err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

module.exports.put = async function(req, res){
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        let rec = req.body;
        let newRec = await db.sites.update(rec);
        res.status(200).json(newRec);
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};