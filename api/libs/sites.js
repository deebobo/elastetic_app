/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

//const config = require.main.require('../api/libs/config').config;
const winston = require('winston');

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
 * get the plugin for the specified definition
 */
async function getPlugin(db, sitename, definition, requestorName){
    let source = null;
    if(definition.plugin.hasOwnProperty('global') && definition.plugin.global === true)
        source = '_common';
    else
        source = sitename;
    let plugin = await db.plugins.find(definition.plugin.name, source);

    if(!plugin)
        throw Error("unknwon plugin for "+ requestorName +": " + definition.name + ", plugin: " + definition.plugin.name);
    if(plugin.type !== requestorName)
        throw Error("plugin is not for " + requestorName + ": " + definition.name + ", plugin: " + definition.plugin.name);
    return plugin;
}

/**
 * get the groups for the specified definition
 */
async function getGroups(db, sitename, definition, requestorName){
    let grps = [];
    for(let i=0; i<definition.groups.length; i++){
        let grp = await db.groups.find(sitename, definition.groups[i]);
        if(!grp)
            throw Error("unknwon group for " + requestorName + ": " + definition.name + ", plugin: " + definition.groups[i]);
        grps.push(grp._id);
    }
    return grps;
}

/**
 * create a page based on the specified definition.
 * This function will replace plugin and group names with id's.
 */
async function createPage(db, sitename, definition){
    definition.site = sitename;
    let plugin = await getPlugin(db, sitename, definition, "page");
    definition.plugin = plugin._id;

    let grps = await getGroups(db, sitename, definition, "page");
    definition.groups = grps;

    await db.pages.add(definition);
}

async function createView(db, sitename, definition) {
    definition.site = sitename;
    let plugin = await getPlugin(db, sitename, definition, "view");
    definition.plugin = plugin._id;

    let grps = await getGroups(db, sitename, definition, "view");
    definition.groups = grps;

    await db.views.add(definition);
}

async function createUser(db, sitename, definition) {
    definition.site = sitename;
    let grps = await getGroups(db, sitename, definition, "user");
    definition.groups = grps;

    await db.users.add(definition);
}

async function createGroup(db, sitename, definition) {

    definition.site = sitename;
    await db.groups.add(definition);
}

async function createConnection(db, sitename, definition) {
    definition.site = sitename;
    let plugin = await getPlugin(db, sitename, definition, "connection");
    definition.plugin = plugin._id;

    await db.connections.add(definition);
}

async function createFunction(db, sitename, definition) {
    definition.site = sitename;
    let plugin = await getPlugin(db, sitename, definition, "function");
    definition.source = plugin._id;

    await db.functions.add(definition);
}

async function createSite(db, sitename, definition) {
    definition._id = sitename;
    let grp = await db.groups.find(sitename, definition.viewGroup);
    if(!grp)
        throw Error("unknwon group for " + requestorName + ": " + definition.name + ", plugin: " + definition.groups[i].name);
    definition.viewGroup = grp._id;

    await db.sites.add(definition);
}

/**
 * apply a template to the site. The template will create users, pages, views & load plugins.
 * @param db {Object} ref to the db.
 * @param template {Object} template definitions.
 * @returns {Promise.<void>}
 */
async function applyTemplate(db, siteName, template, adminName, adminEmail, adminPwd){
    for(let i=0; i < template.definition.length; i++){
        let item = template.definition[i];
        if(item.type === "view")
            await createView(db, siteName, item.value);
        else if(item.type === "page")
            await createPage(db, siteName, item.value);
        else if(item.type === "user") {
            if(item.value.name == "admin"){
                item.value.name = adminName;
                item.value.email = adminEmail;
                item.value.password = adminPwd;
            }
            await createUser(db, siteName, item.value);
        }
        else if(item.type === "group")
            await createGroup(db, siteName, item.value);
        else if(item.type === "plugin")
            await module.exports.installPlugin(db, item.value.name, siteName. item.value.source);
        else if(item.type === "connection")
            await createConnection(db, siteName, item.value);
        else if(item.type === "function")
            await createFunction(db, siteName, item.value);
        else if(item.type === "site")             //details like title, email plugin,..
            await createSite(db, siteName, item.value);
        else if(item.type === "emailtemplate"){          //like email templates and such.
            item.value.site = siteName;
            await db.emailTemplates.add(item.value );
        }
        else if(item.type === "siteData"){          //like email templates and such.
            item.value.site = siteName;
            await db.pluginSiteData.add(item.value );
        }
    }
}

/**
 * prepares the paths to the code (js, html, css) files for the specified section
 * @param section
 */
function prepareCode(section, pluginName, site){
    for(path = 0; path < section.scripts.length; path++)
        section.scripts[path] = "./plugins/" + site + "/" + pluginName + '/' + section.scripts[path]
    if(section.hasOwnProperty('external')){
        section.scripts.push.apply(section.scripts, section.external);
    }
    for(path = 0; path < section.partials.length; path++)
        section.partials[path] =  site + "/" + pluginName + '/' + section.partials[path]
    if(section.hasOwnProperty('css')){
        for(path = 0; path < section.css.length; path++)
            section.css[path] = site + "/" + pluginName + '/' + section.css[path]
    }
    if(section.hasOwnProperty('externalCss'))
        if(section.hasOwnProperty('css'))
            section.css.push.apply(section.css, section.externalCss);
        else
            section.css = section.externalCss;
}

module.exports.installPlugin = async function (db, pluginName, site, file)
{
    let def = require.main.require(file);
    def.site = site;
    if(def.hasOwnProperty('client'))
        prepareCode(def.client, pluginName, site);
    if(def.hasOwnProperty('config'))
        prepareCode(def.config, pluginName, site);
    try{
        await db.plugins.add(def);
        winston.log("info", "succesfully installed plugin", file);
    }
    catch(err){
        winston.log("errro", "failed to instal plugin", file);
    }
};

module.exports.installTemplate = async function (db, name, filename)
{
    let def = require.main.require(filename);

    try{
        await db.siteTemplates.add(def);
        winston.log("info", "succesfully installed template", filename);
    }
    catch(err){
        winston.log("errro", "failed to instal template", filename);
    }
};



/**
 * create a new site.
 * @param db{object} ref to the db object
 * @param definition {Object} the definition describing the site that has to be created.
 * @param asAdmin {bool} when false, no 'admin' will be created in the account, just aa viewer (useful for sub accounts?) Default is true.
 * @returns {Promise.<boolean>}
 */
module.exports.create = async function(db, definition, asAdmin = true){

    let site = await db.sites.find(definition.site);
    if(site && site.length > 0)
        throw Error("The site name is already taken", 'siteExists');

    if(definition.template) {
        let templateDef = await db.siteTemplates.find(definition.template);
        if(!templateDef)
            throw Error("unknown template: " + definition.template);
        await applyTemplate(db, definition.site, templateDef, definition.name, definition.email, definition.password);
    }
    else {
        let admins = {name: "admins", site: definition.site, level: "admin"};
        let editors = {name: "editors", site: definition.site, level: "edit"};
        let viewers = {name: "viewers", site: definition.site, level: "view"};

        let viewGroup = await db.groups.add(viewers);
        let adminRec = await db.groups.add(admins);
        let editorRec =await db.groups.add(editors);

        let site = {_id: definition.site, title: definition.site, viewGroup: viewGroup._id, contactEmail: definition.email, homepage: 'home'};
        await db.sites.add(site);

        let grps = asAdmin === true ? adminRec._id : viewGroup._id;
        let admin = {name: definition.name, email: definition.email, password: definition.password, site: definition.site, groups: [grps], accountState: 'verified'}; // we need the id of the admin record
        await db.users.add(admin);

        let allgroups =  [adminRec._id, viewGroup._id, editorRec._id];
        await createHomepage(db, definition.site, allgroups);

        await createParticleIODevicesView(db, definition.site, allgroups);
        await createGoogleMapView(db, definition.site, allgroups);
    }
};
