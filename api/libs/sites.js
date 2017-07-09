/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

//const config = require.main.require('../api/libs/config').config;

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
    if(plugin.type !== "page")
        throw Error("plugin is not for " + requestorName + ": " + definition.name + ", plugin: " + definition.plugin.name);
    return plugin;
}

/**
 * get the groups for the specified definition
 */
async function getGroups(db, sitename, definition, requestorName){


    let grps = [];
    for(let i=0; i<definition.groups; i++){
        let grp = await db.groups.find(sitename, definition.groups[i].name);
        if(!grp)
            throw Error("unknwon group for " + requestorName + ": " + definition.name + ", plugin: " + definition.groups[i].name);
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
    let plugin = getPlugin(db, sitename, definition, "page");
    definition.plugin = plugin._id;

    let grps = getGroups(db, sitename, definition, "page");
    definition.groups = grps;

    await db.pages.add(definition);
}

async function createView(db, sitename, definition) {
    definition.site = sitename;
    let plugin = getPlugin(db, sitename, definition, "view");
    definition.plugin = plugin._id;

    let grps = getGroups(db, sitename, definition, "view");
    definition.groups = grps;

    await db.views.add(definition);
}

async function createUser(db, sitename, definition) {
    definition.site = sitename;
    let grps = getGroups(db, sitename, definition, "user");
    definition.groups = grps;

    await db.users.add(definition);
}

async function createGroup(db, sitename, definition) {

    definition.site = sitename;
    await db.groups.add(definition);
}

async function createConnection(db, sitename, definition) {
    definition.site = sitename;
    let plugin = getPlugin(db, sitename, definition, "view");
    definition.plugin = plugin._id;

    await db.connections.add(definition);
}

async function createFunction(db, sitename, definition) {
    definition.site = sitename;
    let plugin = getPlugin(db, sitename, definition, "view");
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
            item.value.site = sitename;
            await db.emailTemplates.add(item.value );
        }
        else if(item.type === "siteData"){          //like email templates and such.
            item.value.site = sitename;
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
module.exports.create = async function(db, req, asAdmin = true){

    let site = await db.sites.find(req.body.site);
    if(site && site.length > 0)
        throw Error("The site name is already taken", 'siteExists');

    if(req.body.template) {
        let templateDef = await db.siteTemplates.find(req.body.template);
        if(!templateDef)
            throw Error("unknown template: " + req.body.template);
        await applyTemplate(db, req.body.site, templateDef, req.body.name, req.body.email, req.body.password);
    }
    else {
        let admins = {name: "admins", site: req.body.site, level: "admin"};
        let editors = {name: "editors", site: req.body.site, level: "edit"};
        let viewers = {name: "viewers", site: req.body.site, level: "view"};

        let viewGroup = await db.groups.add(viewers);
        let adminRec = await db.groups.add(admins);
        let editorRec =await db.groups.add(editors);

        let site = {_id: req.body.site, title: req.body.site, viewGroup: viewGroup._id, contactEmail: adminemail, homepage: 'home'};
        await db.sites.add(site);

        let grps = asAdmin === true ? adminRec._id : viewGroup._id;
        let admin = {name: adminname, email: adminemail, password: password, site: req.body.site, groups: [grps], accountState: 'verified'}; // we need the id of the admin record
        await db.users.add(admin);
    }
};
