/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */


class Groups{

    /**
     * @constructor
     * @param collection {object} a reference to the mongo collection that represents the users
     */
    constructor(collection){
        this._groups = collection;
    }

    addGroup(group){
        let grp = new this._groups(group);
        return grp.save();
    }

    listGroups(site){
        let query = this._groups.find({site: site});
        return query.exec();
    }
}

module.exports = Groups;