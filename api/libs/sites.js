/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

//const config = require.main.require('../api/libs/config').config;


/**
 * create a record for the home page that points to a homepage plugin.
 * @param db {object} a ref to the db object (small optimization)
 * @param sitename {string} the name of the site
 * @param grps [string] list of groups that have access to the page.
 * @returns {Promise.<void>}
 */
async function createHomepage(db, sitename, grps){
    let homepagePluginId = await db.plugins.find("left-menu-bar homepage", "_common");
    let data = {menu:[
        {
            name: 'Administration',
            type: 'toggle',
            pages: [{
                name: 'General',
                type: 'link',
                url: 'site.general',
                //url: 'site.page',
                icon: 'fa fa-wrench'
            }, {
                name: 'Email',
                type: 'link',
                url: 'site.email',
                icon: 'fa fa-envelope'
            }, {
                name: 'Authorization',
                type: 'link',
                url: 'site.authorization',
                icon: 'fa fa-user-circle'
            }, {
                name: 'connections',
                url: 'site.connections',
                type: 'link',
                icon: 'fa fa-cloud'
            }, {
                name: 'functions',
                url: 'site.functions',
                type: 'link',
                icon: 'fa fa-connectdevelop'
            }/*, {
                name: 'Plugins',
                url: 'site.plugins',
                type: 'link',
                icon: 'fa fa-plug'
            }*/]
        },
        {
            name: 'particle io devices',
            type: 'link',
            view: 'particle io devices',
            icon: 'fa fa-list'
        },
        {
            name: 'map',
            type: 'link',
            view: 'map',
            icon: 'fa fa-globe'
        }
    ]};
    let page = { name: "home", site: sitename, plugin:homepagePluginId._id, groups: grps, partial: 0, controller: "siteHomeController", data: data };
    await db.pages.add(page);
}

async function createParticleIODevicesView(db, sitename, grps) {
    let particlePluginId = await db.plugins.find("particle_io_devices_view", "_common");
    let view = { name: "particle io devices", site: sitename, plugin:particlePluginId._id, groups: grps, partial: 0, controller: "particlIODevicesViewController" };
    await db.views.add(view);
}

async function createGoogleMapView(db, sitename, grps) {
    let googleMapPluginId = await db.plugins.find("google_map_view", "_common");
    let view = { name: "map", site: sitename, plugin:googleMapPluginId._id, groups: grps, partial: 0, controller: "googleMapViewController" };
    await db.views.add(view);
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

    await db.sites.add({_id: sitename, title: sitename, viewGroup: viewGroup._id, contactEmail: adminemail, homepage: 'home'});

    let grps = asAdmin === true ? adminRec._id : viewGroup._id;
    let admin = {name: adminname, email: adminemail, password: password, site: sitename, groups: [grps], accountState: 'verified'}; // we need the id of the admin record
    await db.users.add(admin);

    let allgroups =  [adminRec._id, viewGroup._id, editorRec._id];
    await createHomepage(db, sitename, allgroups);

    await createParticleIODevicesView(db, sitename, allgroups);
    await createGoogleMapView(db, sitename, allgroups);
};