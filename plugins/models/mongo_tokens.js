/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/**@ignore */
const mongoose = require('mongoose');


class Tokens{

    /**
     * @constructor
     * creates the collection that stores the token (authorisation) information for plugins.
     * This allows plugins to have callbacks with their own authenticaton (ex: particle.io)
     * required fields:
     *  - token: the token
     * 	- site: the site to which this group applies
     *  - resourceType: the type of resource for which this token provides authentication.
     *  	- connection
     *		- function
     *  - resourceId: the id of the resource.
     */
    constructor(){
        let tokensSchema = new mongoose.Schema({
            token: {type: String },
            site: String,
            resourceType: {type: String, enum: ['connection', 'function']},      //the type of resource for which this token provides authentication.
            resourceId: String                                                   //the id of the resource for which this token is valid
        });
        this._tokens = mongoose.model('tokens', tokensSchema);
    }


    add(token){
        let rec = new this._tokens(group);
        return rec.save();
    }


    update(token){
        return this._groups.findOneAndUpdate({"_id": token._id}, token).exec();
    }


    list(site){
        let query = this._groups.find({site: site});
        return query.exec();
    }

}

module.exports = Tokens;