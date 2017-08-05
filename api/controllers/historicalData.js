/**
 * Created by Deebobo.dev on 4/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const winston = require('winston');

/* GET historical data.
  param from the path: connection = the connection name that represents the data store.
 optonal argumehts:
 - from: date
 - to: date
 - source: id of connection that stored the data  (ex: source = particle.io connection) .
 - device: unique identifier (within the source) for the device
 - page
 - pagesize
 *  */
module.exports.get = async function(req, res)
{
    try{
        let plugins = await req.app.get('plugins');
        let db = plugins.db;
        let connection = await db.connections.findById(req.params.connection);
        if(connection){
            if(connection.plugin.name in plugins.plugins) {
                let plugin = plugins.plugins[connection.plugin.name].create();
                await plugin.connect(connection.content);                                 //allow the plugin to connect, if not yet done.
                let results = await plugin.queryHistory(connection.content, {
                    from: req.query.from,
                    to: req.query.to,
                    source: req.query.source,
                    device: req.query.device,
                    field: req.query.field,
                    page: req.query.page,
                    pagesize: req.query.pagesize,
                    site: req.params.site
                });
                await plugin.close();
                res.status(200).json(results);
            }
            else
                res.status(401).json({message:"unknown connection-plugin: " + connection.plugin});
        }
        else
            res.status(401).json({message:"unknown connection: " + req.params.connection});
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

module.exports.getTimerange = async function (req, res){
    try{
        let plugins = await req.app.get('plugins');
        let db = plugins.db;
        let connection = await db.connections.findById(req.params.connection);
        if(connection){
            if(connection.plugin.name in plugins.plugins) {
                let plugin = plugins.plugins[connection.plugin.name].create();
                await plugin.connect(connection.content);                                 //allow the plugin to connect, if not yet done.
                let results = await plugin.getTimerange(connection.content, {
                    from: req.query.from,
                    to: req.query.to,
                    source: req.query.source,
                    device: req.query.device,
                    field: req.query.field,
                    page: req.query.page,
                    pagesize: req.query.pagesize,
                    site: req.params.site
                });
                await plugin.close();
                res.status(200).json(results);
            }
            else
                res.status(401).json({message:"unknown connection-plugin: " + connection.plugin});
        }
        else
            res.status(401).json({message:"unknown connection: " + req.params.connection});
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};

module.exports.post = async function(req, res){
    try{
        let plugins = await req.app.get('plugins');
        let db = plugins.db;
        let connection = await db.connections.findById(req.params.connection);
        if(connection){
            if(connection.plugin.name in plugins.plugins) {
                let plugin = plugins.plugins[connection.plugin.name].create();
                await plugin.connect(connection.content);                                 //allow the plugin to connect, if not yet done.
                let res = await plugin.storeHistory(req.params.site, req.body, connection);
                await plugin.close();
                res.status(200).json(res);
            }
            else
                res.status(401).json({message:"unknown connection-plugin: " + connection.plugin});
        }
        else
            res.status(401).json({message:"unknown connection: " + req.params.connection});
    }
    catch(err){
        winston.log("error", err);
        res.status(500).json({message:err.message});
    }
};