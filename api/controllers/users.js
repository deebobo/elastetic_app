/**
 * Created by elastetic.dev on 10/06/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
 'use strict';
 
//const auth = require.main.require('../api/libs/auth');
const winston = require('winston');
const email = require.main.require('../api/libs/email');
const auth = require.main.require('../api/libs/auth');

/* GET users listing. */
module.exports.list = async function(req, res)
{
    try{
        if(!req.params.site)
            return status(404).json({message: "invalid parameters"});
        let db = await req.app.get('plugins');
        db = db.db;
        let result = await db.users.list(req.params.site);
        res.status(200).json(result);
		winston.log("warning", "add check to see if user has admin rights");
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};


/* GET single page, if the requestor is allowed to see it. */
module.exports.getUser = async function(req, res) {
    let grp = null;
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        let result = await db.users.find(req.params.user);
        if(result)
		    res.status(200).json(result);
        else
            res.status(404).json({message: "not found"});
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/* create group. */
module.exports.create = async function(req, res) {
    try{
        let db = await req.app.get('plugins');
		db = db.db;
		let rec = req.body;
        if(req.params.site)                         //parameter, if exists, takes presedence
            rec.site = req.params.site;
		let found = await db.users.add(rec);
		res.status(200).json(found);
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

module.exports.addToGrp = async function(req, res) {
    try{
        let db = await req.app.get('plugins');
		db = db.db;
		let found = await db.users.addGroup(req.params.user, req.params.group);
		res.status(200).json(found);
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

module.exports.updateUser = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res) || req.user._id == req.body._id){    //auth will set the error message in res if there is a problem. The user can change his own record.
            let db = await req.app.get('plugins');
            db = db.db;
            let rec = req.body;
            let newRec = await db.users.update(rec);
            res.status(200).json(newRec);
        }
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

module.exports.removeFromGrp = async function(req, res) {
    try{
        let db = await req.app.get('plugins');
		db = db.db;
		let found = await db.users.removeGroup(req.params.user, req.params.group);
		res.status(200).json(found);
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

module.exports.invite = async function(req, res){
	try{
        req.checkBody('email', 'Please provide a valid email to send the invitation to').isEmail();

        let errors = req.validationErrors();
        if (errors) {
            res.send(errors, 400);
            return;
        }
        let pluginMan = await req.app.get('plugins');
		await email.sendMail(site, req.user, pluginMan,  "invite");
		res.status(200).json({message:"ok"});
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/** the body shoudl contain the new password.
*/
module.exports.changePwd = async function(req, res){
	try{
		if( req.params.user._id == req.user._id){
			let plugins = await req.app.get('plugins');
			let db = plugins.db;
			req.user.password = req.body;
			await db.users.update(req.user);
			res.status(200).json({message: "success"});
		}
		else
			res.status(403).json({message: "invalid request"});
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};
