/**
 * Created by elastetic.dev on 20/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

/*
const winston = require('winston');
const helper = require('sendgrid').mail;
 
class SendGridMail{
	constructor(){
	}
	
	async send(site, to, subject, html){
		let mailerconf = await db.pluginSiteData.get(site, 'sendgrid_mail');		//get the data record for the plugin config.
		
		let fromEmail = new helper.Email(mailerconf.data.from);
		let toEmail = new helper.Email(to);
		let content = new helper.Content('text/plain', html);
		let mail = new helper.Mail(fromEmail, subject, toEmail, content);
		
		var sg = require('sendgrid')(mailerconf.data.key);
		var request = sg.emptyRequest({method: 'POST', path: '/v3/mail/send', body: mail.toJSON()});

		sg.API(request, function (error, response) {
		  if (error) {
			winston.log("error", error);
		  }
		  winston.log("info", response.statusCode);
		  winston.log("info", response.body);
		  winston.log("info", response.headers);
		});
	}
}

//required for all plugins. returns information about the plugin
let getPluginConfig = function (){
    return {
        name: "sendgrid_mail",
        category: "mail",
        title: "Sendgrid",
        description: "Send email using SendGrid",
        author: "elastetic",
        version: "0.0.1",
        icon: "http://10477-presscdn-0-4.pagely.netdna-cdn.com/wp-content/uploads/2013/09/logo_full_color_stk-6636d251dca5eb705062b63399914ebb.png",
        license: "GPL-3.0",
        type: "mail",
        config: {
            partials: [
                "partials/sendgrid_config_partial.html"
            ]
        },
		dependencies:{
			"sendgrid": "^5.2.0",
		},
        create: function(){ return new SendGridMail();}
    };
};

module.exports = {getPluginConfig: getPluginConfig};*/
