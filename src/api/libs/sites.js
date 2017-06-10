/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

//const config = require.main.require('../api/libs/config').config;

let _homepagePluginId = null;                           //a global for this script only: only need to retrieve the id 1 time, it always remains the same value.

/**
 * create a record for the home page that points to a homepage plugin.
 * @param db {object} a ref to the db object (small optimization)
 * @param sitename {string} the name of the site
 * @param grps [string] list of groups that have access to the page.
 * @returns {Promise.<void>}
 */
async function createHomepage(db, sitename, grps){
    if (_homepagePluginId === null)
        _homepagePluginId = await db.plugins.find("left-menu-bar homepage", "_common");
    let page = { name: "home", site: sitename, plugin:_homepagePluginId._id, groups: grps };
    await db.pages.add(page);
}

/**
 * create a new site.
 * @param db{object} ref to the db object
 * @param sitename {string} the name of the site
 * @param adminname {string} name of the administrator
 * @param adminemail {string} email of the administrator
 * @param password {string} password
 * @param asAdmin {bool} when false, no 'admin' will be created in the account, just aa viewer (useful for sub accounts?) Default is true.
 * @returns {Promise.<boolean>}
 */
module.exports.create = async function(db, sitename, adminname, adminemail, password, asAdmin = true){

    let site = await db.sites.find(sitename);
    if(site && site.length > 0)
        throw Error("The site name is already taken", 'siteExists');

    let admins = {name: "admins", site: sitename, level: "admin"};
    let editors = {name: "editors", site: sitename, level: "edit"};
    let viewers = {name: "viewers", site: sitename, level: "view"};

    let viewGroup = await db.groups.add(viewers);
    let adminRec = await db.groups.add(admins);
    let editorRec =await db.groups.add(editors);

    await db.sites.add({_id: sitename, viewGroup: viewGroup._id, contactEmail: adminemail, homepage: 'home'});

    let grps = asAdmin === true ? adminRec._id : viewGroup._id;
    let admin = {name: adminname, email: adminemail, password: password, site: sitename, groups: [grps]}; // we need the id of the admin record
    await db.users.add(admin);

    await createHomepage(db, sitename, [adminRec._id, viewGroup._id, editorRec._id]);
};