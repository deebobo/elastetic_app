/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

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
            createdOn:{type: Date, default: Date.now()}
        });
        connectionSchema.index({ name: 1, site: 1}, {unique: true});        //fast access at name & site level
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
        let record = new this._connections(connection);
        return record.save();
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
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    update(connection){
        this._preparePlugin(connection);
        return this._connections.findOneAndUpdate({"_id": connection._id}, connection).exec();
    }

    /** Get a list of all the available connections for a site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the list of connections
     */
    list(site){
        let query = this._connections.find({site: site}).populate('plugin');
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
        return this._connections.findOne( { name: value, site: site } ).populate('plugin').exec();
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
        return this._connections.findOneAndRemove( { _id: id } ).exec();
    }
}

module.exports = Connections;
