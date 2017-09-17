/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/**@ignore */
const mongoose = require('mongoose');


/**
 * @class represents the collection of connection
 */
class Connections{

    /**
     * @constructor
     * @param collection {object} a reference to the mongo collection that represents the connections
     */
    constructor(){
        let connectionSchema = new mongoose.Schema({
            name: String,															//name of the template
            site: String,
            plugin: {type: mongoose.Schema.Types.ObjectId, ref: 'plugins'},
            content: Object,
            warning: String,                                                    //any warning that was rendered while creating the connection.
			features: [{ type: String }],										//supported features of this connection. Ex: get/post/put/history/poi/devices/...  Allows interfaces to decide if the connection is used or not.
			groups: [{type: mongoose.Schema.Types.ObjectId, ref: 'groups'}],
            createdOn:{type: Date, default: Date.now()}
        });
        connectionSchema.index({ name: 1, site: 1}, {unique: true});        //fast access at name & site level
        connectionSchema.index({ plugin: 1, site: 1});        //fast access at name & site level
        this._connections = mongoose.model('connections', connectionSchema);
    }

    /**
     * make certain that the plugin is of the correct data type.
     * @param connection
     * @private
     */
    _preparePlugin(connection){
        if(typeof connection.plugin !== 'string')
            connection.plugin = mongoose.Types.ObjectId(connection.plugin._id);
        else
            connection.plugin = mongoose.Types.ObjectId(connection.plugin);
    }

    /**
     * adds a connection definition to the db
     *
     * @name .add()
     * @param {Object} `template` details about the connection. The object should contain the following fields:
     *	- name: the name of the template.
     * 	- site: the site on which the email template was created
     *	- connection: id of the plugin
     * 	- content: object for the config of the connection.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    add(connection){
        this._preparePlugin(connection);
		return new Promise((resolve, reject) => {
            let record = new this._connections(connection);
            record.save(function (err) {
                if (err) {
                    winston.log("error", 'create connection failed', connection);
                    reject(err);
                }
                else {
                    record.populate("plugin", function(err, res) {
                            if (err) {
                                winston.log("error", 'create-populate connection failed', connection);
                                reject(err);
                            } else {
                                record.populate("groups", function(err, res){
                                    if (err) {
                                        winston.log("error", 'create-populate connection failed', connection);
                                        reject(err);
                                    } else
                                        resolve(res);
                                });
                            }
                        }
                    );
                }
            });
        });
    }

    /**
     * updates a connection definition to the db
     *
     * @name .update()
     * @param {Object} `connection` details about the connection. The object should contain the following fields:
     *	- name: the name of the template.
     * 	- site: the site on which the email template was created
     *	- connection: id of the plugin
     * 	- content: object for the config of the connection.
     * @param returnOld {boolean}, default = false. Set to true if the old record needs to be returned.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    update(connection, returnOld){
        if(!returnOld)                          //in case that it's not defined
            returnOld = false;
        this._preparePlugin(connection);
        return this._connections.findOneAndUpdate({"_id": connection._id}, connection, {new: !returnOld}).populate('plugin').populate('groups').exec();
    }

    /** Get a list of all the available connections for a site.
     * @param site {string}  - name of the site.
     * @param plugin {string}  -  optional id of the plugin to filter on.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the list of connections
     */
    list(site, plugin){
        let query = null;
        if(plugin){
            query = this._connections.find({site: site, plugin: plugin}).populate('plugin').populate('groups');
        }else{
            query = this._connections.find({site: site}).populate('plugin').populate('groups');
        }
        return query.exec();
    }

    /**
     * finds a connection for a specific site.
     *
     * @name .find()
     * @param value {string}  - nameof the connection.
     * @param site {string}  - name of the site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    find(name, site){
        return this._connections.findOne( { name: name, site: site } ).populate('plugin').populate('groups').exec();
    }

    /**
     * finds a connection by it's id
     *
     * @name .findById()
     * @param id {string}  - id  the connection.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    findById(id){
        return this._connections.findOne( { _id: id } ).populate('plugin').populate('groups').exec();
    }

    /**
     * removes a connection for a specific site.
     *
     * @name .delete()
     * @param id {String}  - the id of the object that needs to be deleted.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    delete(id){
        return this._connections.findOneAndRemove( { _id: id } ).populate('plugin').populate('groups').exec();
    }
}

module.exports = Connections;
