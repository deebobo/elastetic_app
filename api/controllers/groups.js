/**
 * Created by Deebobo.dev on 10/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
//const auth = require.main.require('../api/libs/auth');
const winston = require('winston');

/* GET groups listing. */
module.exports.list = async function(req, res)
{
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        let grps = await db.groups.list(req.params.site);
        res.status(200).json(grps);
		winston.log("warning", "add check to see if user has admin rights");
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

/* GET groups listing of viewable groups. */
module.exports.listViews = async function(req, res)
{
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        let grps = await db.groups.listForLevel(req.params.site, 'view');
        res.status(200).json(grps);
		winston.log("warning", "add check to see if user has admin rights");
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

/* GET single page, if the requestor is allowed to see it. */
module.exports.getGrp = async function(req, res) {
    let grp = null;
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        grp = await db.groups.find(req.params.group, req.params.site);
		res.status(200).json(grp);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

module.exports.updateGrp = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let db = await req.app.get('plugins');
            db = db.db;
            let rec = req.body;
            let newRec = await db.groups.update(rec);
            res.status(200).json(newRec);
        }
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

/* create group. */
module.exports.create = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let db = await req.app.get('plugins');
            db = db.db;
            let rec = req.body;
            let res = await db.groups.add(rec);
            res.status(200).json(res);
        }
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};