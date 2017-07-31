/**
 * Created by Deebobo.dev on 26/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
*/

const url = require('url');
const winston = require('winston');
const urljoin = require('url-join');
 
 
/** replaces any parameters that were specified in the email template.
  * parameters can be:
  * {{username}}: name of the user
 */
function replaceParams(template, user, site){
	let result = template.replace(/{{username}}/g, user.name);
	result = result.replace(/{{site}}/g, site.name);
	return result;
}
 
 
 /** send a registration confirmation email to the specified user.
 * @param {object} 'site' the site that the user registered on
 * @param {object} 'user' the user to send an email to
 * @param {object} 'pluginMan' ref to the plugin manager. If ommited, db will be loaded
 * @param {string} 'url' the url (without activation token)
 * @returns {Promise.<void>}
 */
 module.exports.sendEmailWithLink = async function (site, user, pluginMan, uri, templateName) {
	let db = pluginMan.db;
	let template = await db.emailTemplates.find(templateName, site.name);
	if(template){
		let mailhandler = await pluginMan.getMailHandlerFor(site.name);
		if(mailhandler){
			let body = replaceParams(template.body, user, site).replace(/{{activationlink}}/g, urljoin(uri, user.generateJwt()));
			let subject = replaceParams(template.subject, user, site);
			return mailhandler.send(db, site.name, user.email, subject, body);
		} 
	}
	else
        winston.log("error", "failed to find template:", "registration confirmation");
};


module.exports.sendMail = async function (site, user, pluginMan, templateName){
	db = pluginMan.db;
	let template = await db.emailTemplates.find(templateName, site.name);
	if(template){
		let mailhandler = await pluginMan.getMailHandlerFor(site.name);
		if(mailhandler){
			let body = replaceParams(template.body, user, site);
			let subject = replaceParams(template.subject, user, site);
			mailhandler.send(db, site.name, user.email, subject, body);
		} 
	}
    else
        winston.log("error", "failed to find template:", templateName);
};