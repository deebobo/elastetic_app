/**
 * Created by Deebobo.dev on 10/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
const auth = require.main.require('../api/libs/auth');
const winston = require('winston');

/* GET pages listing that the current user is allowed to see. */
module.exports.get = async function(req, res)
{
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        let pages = await db.pages.list(req.params.site);
        let allowed = [];
        for(let item of pages){
            if(auth.allowed(item.groups, req.user.groups))
                allowed.push(item);
            else
                return;                                                     //something was not allowed, error message has been set by auth
        }
        res.status(200).json(allowed);
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/* GET single page, if the requestor is allowed to see it. */
module.exports.getPage = async function(req, res) {
    let page = null;
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        page = await db.pages.find(req.params.page, req.params.site);
        if(page) {
            if (auth.allowed(page.groups, req.user.groups, res))         //auth will set the error message in res if there is a problem.
                res.status(200).json(page);
        }
        else
            res.status(404).json({message: "record not found"});
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/* GET pages listing. */
module.exports.create = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let db = await req.app.get('plugins');
            db = db.db;
            let rec = req.body;
            rec.site = req.params.site;
            let res = await db.pages.add(rec);
            res.status(200).json(res);
        }
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/* GET pages listing. */
module.exports.update = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let db = await req.app.get('plugins');
            db = db.db;
            let rec = req.body;
			rec.name = req.params.page;
			rec.site = req.params.site;
            let newRec = await db.pages.update(rec);
            res.status(200).json(newRec);
        }
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

/* GET pages listing. */
module.exports.delete = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let db = await req.app.get('plugins');
            db = db.db;
            let newRec = await db.pages.delete(req.params.page, req.params.site);
            res.status(200).json(newRec);
        }
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};