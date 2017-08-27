/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/**@ignore */ 
const mongoose = require('mongoose');

/**
 * @class represents the collection of function
 */
class Functions{

    /**
     * @constructor
     * @param collection {object} a reference to the mongo collection that represents the functions
     */
    constructor(){
        let functionSchema = new mongoose.Schema({
            name: String,
            site: String,
            source: {type: mongoose.Schema.Types.ObjectId, ref: 'plugins'},
            data: Object,
            warning: String,                                                     //stores errors/warnings that were generated while creating the function. These didn't cause a failure in the creation (function can be stored), but the setup went wrong, user should correct and retry
            createdOn:{type: Date, default: Date.now()}
        });
        functionSchema.index({ source: 1, site: 1});        //fast access at name & site level
        this._functions = mongoose.model('functions', functionSchema);
    }

    /**
     * adds a function definition to the db
     *
     * @name .add()
     * @param {Object} `template` details about the function. The object should contain the following fields:
     *	- name: the name of the template.
     * 	- site: the site on which the email template was created
     *	- function: id of the plugin
     * 	- content: object for the config of the function.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    add(rec){
        //this._preparePlugin(rec);
        return new Promise((resolve, reject) => {
            let record = new this._functions(rec);
            record.save(function (err) {
                if (err) {
                    winston.log("error", 'create function failed', connectionInfo);
                    reject(err);
                }
                else {
                    record.populate("source", function(err, res){
                        if(err){
                            winston.log("error", 'create-populate function failed', connectionInfo);
                            reject(err);
                        }else
                            resolve(res); }
                    );
                }
            });
        });
    }

    /**
     * updates a function definition to the db
     *
     * @name .update()
     * @param {Object} `function` details about the function. The object should contain the following fields:
     *	- name: the name of the template.
     * 	- site: the site on which the email template was created
     *	- function: id of the plugin
     * 	- content: object for the config of the function.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was added
     */
    update(id, value){
        return this._functions.findOneAndUpdate({"_id": id}, value, {new: true}).populate('source').exec();
    }

    /** Get a list of all the available functions for a site.
     * @param site {string}  - name of the site.
     * @param plugin {string}  - optional, name of the function to list.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the list of functions
     */
    list(site, plugin){
        let query = null;
        if(plugin){
            query = this._functions.find({site: site, source: plugin}).populate('source');
        }else{
            query = this._functions.find({site: site}).populate('source');
        }
        return query.exec();
    }

    /**
     * finds a function for a specific site.
     *
     * @name .find()
     * @param value {string}  - nameof the function.
     * @param site {string}  - name of the site.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    findById(id){
        return this._functions.findOne( { _id: id } ).populate('source').exec();
    }

    /**
     * removes a function for a specific site.
     *
     * @name .delete()
     * @param id {String}  - the id of the object that needs to be deleted.
     * @return {Promise}] a promise to perform async operations with. The result of the promise is the record that
     * was found
     */
    delete(id){
        return this._functions.findOneAndRemove( { _id: id } ).exec();
    }
}

module.exports = Functions;
