/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

  
const nodemailer = require('nodemailer');
const winston = require('winston');


/** Send mail using a private account of the site admin.
 * based on https://nodemailer.com/about/
*/
class PrivateMailer{
	
	/**create the object
	* This function is called with the new operator. It will initiate the plugin.
	* makes certain that the mailer config collection is created.
	
	config data:
	{ host: 'smtp.example.com',
	  port: 465,
	  secure: true,					// secure:true for port 465, secure:false for port 587
	  auth: {
				user: 'username@example.com',
				pass: 'userpass'
			}
	  from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
	}
	
    * @constructor
	*/
	constructor(){
	}
	
	
	
	/**
	* send an email on behalf of the specified site, to the specified recepiant.
	@param to {string} list of receivers ex: 'bar@blurdybloop.com, baz@blurdybloop.com'
	*/
	send(site, to, subject, html){
		
		let mailerconf = db.pluginSiteData.get('privateMailer', site);		//get the data record for the plugin config.
		
		let transporter = nodemailer.createTransport(mailerconf.data);		// create reusable transporter object using the default SMTP transport
		let mailOptions = {													// setup email data with unicode symbols
			from: mailerconf.data.from,
			to: to,
			subject: subject,  //'Hello ✔', // Subject line
			html: html //'<b>Hello world ?</b>' // html body
		};

		transporter.sendMail(mailOptions, (error, info) => {				// send mail with defined transport object
			if (error) {
				return winston.log("error", error);
			}
			winston.log("info", 'Message %s ; id: %s ; sent: %s', mailOptions, info.messageId, info.response);
		});
	}
}

//required for all plugins. returns information about the plugin
let getPluginConfig = function (){
    return {
        name: "private mail",
        category: "mail",
        title: "Send email",
        description: "Send email using the private email address of the site admin",
        author: "DeeBobo",
        version: "0.0.1",
        icon: "/images/plugin_images/MongoDB_Gray_Logo_FullColor_RGB-01.jpg",
        license: "GPL-3.0",
		config:{
			partial: "private_mailer_config_partial.html",
			code: ["private_mailer_config_controller.js"]
		},
        create: function(){ return new PrivateMailer();}
    };
}

module.exports = {getPluginConfig: getPluginConfig};