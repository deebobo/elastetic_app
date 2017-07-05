/**
 * Created by Deebobo.dev on 4/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */


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
        let connection = await db.connections.get(req.params.connection, req.params.site);
        if(connection){
            if(connection.plugin in plugins.plugins) {
                let plugin = plugins.plugins[connection.plugin].create();
                await plugin.connect(connection.content);                                 //allow the plugin to connect, if not yet done.
                let res = plugin.queryHistory({
                    from: req.query.from,
                    to: req.query.to,
                    source: req.query.source,
                    device: req.query.device
                });
                res.status(200).json(pages);
            }
            else
                res.status(401).json({message:"unknown connection-plugin: " + connection.plugin});
        }
        else
            res.status(401).json({message:"unknown connection: " + req.params.connection});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};

module.exports.post = async function(req, res){
    try{
        let plugins = await req.app.get('plugins');
        let db = plugins.db;
        let connection = await db.connections.get(req.params.connection, req.params.site);
        if(connection){
            if(connection.plugin in plugins.plugins) {
                let plugin = plugins.plugins[connection.plugin].create();
                await plugin.connect(connection.content);                                 //allow the plugin to connect, if not yet done.
                let res = await plugin.storeHistory(req.body);
                res.status(200).json(res);
            }
            else
                res.status(401).json({message:"unknown connection-plugin: " + connection.plugin});
        }
        else
            res.status(401).json({message:"unknown connection: " + req.params.connection});
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
};