/**
 * Created by Deebobo.dev on 26/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
*/

const url = require('url');
 
 
/** replaces any parameters that were specified in the email template.
  * parameters can be:
  * {{username}}: name of the user
 */
function replaceParams(template, user){
	let result = template.replace(/{{username}}/g, user.name);
	result = result.replace(/{{useremail}}/g, user.email);
	return result;
}
 
 
 /** send a registration confirmation email to the specified user.
 * @param {object} 'site' the site that the user registered on
 * @param {object} 'user' the user to send an email to
 * @param {object} 'pluginMan' ref to the plugin manager. If ommited, db will be loaded
 * @param {string} 'url' the url (without activation token)
 * @returns {Promise.<void>}
 */
 module.exports.sendEmailConfirmation = async function (site, user, pluginMan, uri) {
	db = pluginMan.db;
	let template = await db.emailTemplates.find("registration confirmation", site.name);
	if(template){
		let mailhandler = await pluginMan.getMailHandlerFor(site.name);
		if(mailhandler){
			let body = replaceParams(template.body).replace(/{{activationlink}}/g, url.resolve(uri, "activate", user.generateJwt()));
			let subject = replaceParams(template.subject);
			mailhandler.send(site.name, user.email, subject, body);
		} 
	}
};


module.exports.sendMail = async function (site, user, pluginMan, templateName){
	db = pluginMan.db;
	let template = await db.emailTemplates.find(templateName, site.name);
	if(template){
		let mailhandler = await pluginMan.getMailHandlerFor(site.name);
		if(mailhandler){
			let body = replaceParams(template.body);
			let subject = replaceParams(template.subject);
			mailhandler.send(site.name, user.email, subject, body);
		} 
	}
}