/**
 * Created by Deebobo.dev on 10/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const auth = require.main.require('../api/libs/auth');

/* GET pages listing that the current user is allowed to see.
   optionally provide a filter value through a variable. Example: GET connection?puglin=sdfsfiower
 *  */
module.exports.get = async function(req, res)
{
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        let pages = await db.connections.list(req.params.site, req.query.plugin);
        res.status(200).json(pages);
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

/* GET single page, if the requestor is allowed to see it. */
module.exports.getConnection = async function(req, res) {
    let page = null;
    try{
        let db = await req.app.get('plugins');
        db = db.db;
        connection = await db.connections.find(req.params.connection, req.params.site);
        res.status(200).json(page);
    }
    catch(err){
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
            if(typeof rec.plugin !== 'string')
                rec.plugin = rec.plugin._id;
            rec.site = req.params.site;
            let newRec = await db.connections.add(rec);
            res.status(200).json(newRec);
        }
    }
    catch(err){
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
            let newRec = await db.connections.update(rec);
            res.status(200).json(newRec);
        }
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

/* GET pages listing. */
module.exports.delete = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let db = await req.app.get('plugins');
            db = db.db;
            let newRec = await db.connections.delete(req.params.connection);
            res.status(200).json(newRec);
        }
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};