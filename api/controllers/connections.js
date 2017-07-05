/**
 * Created by Deebobo.dev on 10/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const auth = require.main.require('../api/libs/auth');

/* GET connections list.
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

/* GET single connection, if the requestor is allowed to see it. */
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

/**
 * makes certain that the plugin field is an id, not an object.
 * @param rec
 * @returns {string} the name of the plugin
 */
async function cleanPluginRef(rec, db){
    let pluginName = null;
    if(typeof rec.plugin !== 'string') {                //update the rec to id if needbee and retrieve the name of the plugin so we can find any server side version of it.
        pluginName = rec.plugin.name;
        rec.plugin = rec.plugin._id;
    }
    else{
        let pluginref = await db.plugins.findById(rec.plugin);
        pluginName = pluginref.name;
    }
    return pluginName;
}

async function preparePlugin(rec, plugins){

    if(pluginName in plugins.plugins){                  //check if the server side needs to do something for the connection.
        let plugin = plugins.plugins[pluginName].create();
        await plugin.connect(rec.content);                    //check for the connection to succeed
        plugin.create(rec.content);                                //make certain that everything is set up correctly for the plugin.
    }
}

/* create a connection */
module.exports.create = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let plugins = await req.app.get('plugins');
            let db = plugins.db;
            let rec = req.body;
            await cleanPluginRef(rec, db);
            rec.site = req.params.site;
            let newRec = await db.connections.add(rec);
            try {
                await preparePlugin(rec, plugins);                    //do after add, so that a failure will only cause a warning.
            }
            catch (err){
                newRec.warning = err;
            }
            res.status(200).json(newRec);
        }
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

/* update a conneciton. */
module.exports.update = async function(req, res) {
    try{
        if(auth.canWrite(req.user.groups, res)){                //auth will set the error message in res if there is a problem.
            let plugins = await req.app.get('plugins');
            let db = plugins.db;
            let rec = req.body;
            await cleanPluginRef(rec, db);
            let newRec = await db.connections.update(rec);
            try {
                await preparePlugin(rec, plugins);                    //do after add, so that a failure will only cause a warning.
            }
            catch (err){
                newRec.warning = err;
            }
            res.status(200).json(newRec);
        }
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

/* delete the specified conneciton. */
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