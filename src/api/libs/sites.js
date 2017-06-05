/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

//const config = require.main.require('../api/libs/config').config;


/**
 *
 * @param db
 * @param sitename
 * @param adminname
 * @param adminemail
 * @param password
 * @param asAdmin
 * @returns {Promise.<boolean>}
 */
module.exports.create = async function(db, sitename, adminname, adminemail, password, asAdmin){

    let site = await db.sites.find(sitename);
    if(site && site.length > 0)
        throw Error("The site name is already taken", 'siteExists');

    let admins = {name: "admins", site: sitename, level: "admin"};
    let editors = {name: "editors", site: sitename, level: "edit"};
    let viewers = {name: "viewers", site: sitename, level: "view"};

    let viewGroup = await db.groups.add(viewers);
    let adminRec = await db.groups.add(admins);
    await db.groups.add(editors);

    await db.sites.add({_id: sitename, viewGroup: viewGroup._id, contactEmail: adminemail});

    let grps = asAdmin === true ? adminRec._id : viewGroup._id;
    let admin = {name: adminname, email: adminemail, password: password, site: sitename, groups: [grps]}; // we need the id of the admin record
    await db.users.add(admin);
};