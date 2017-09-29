# plugins
- the system is build up out of plugins. Almost every feature is abstracted away as a plugin so that it can be replaced with another implementation. It also allows you to add new features to the application.
- The following types of plugins are supported:
	- [db](db_plugin.md)
	- [email](email.md)
	- [contols](controls.md)
	- [functions](functions.md)
- all plugins have to implement a function called 'getPluginConfig'. The plugin module has to export this function and it should return an object with the following fields: 
	- create: a reference to the function (or class) that creates a new plugin
	- name: the name of the plugin. this is used to identify the plugin in various places like the config file for the db or in views for controls and such.
	- category: the category of the plugin. current categories are:
		- db
		- email
		- control
		- function
	- title: a short description (1 line) of the plugin
	- description: (optional) a long description for the plugin
	- author: (optional) the name of the author
	- version: (optional) the version nr of the plugin
	- icon: (optional) an URI to the icon for the plugin
	- license: (optional) the license of the plugin
	- config: (optional) when the plugin can be configured, it should declare a config section that contains the following fields:
		- partial: the html file to use as partial and 
		- code: (optional): the code files that need to be loaded by the client.
	- client: (optional) When this field is defined, the plugin is avaible for clients. It has the same structure as the config section. It determines which partial should be used for the plugin and any code that needs to be loaded into the client.

Example:

```
function getPluginConfig(){
    return {
        name: "mongodb",
        category: "db",
        title: "store the data in a mongo database",
        description: "this is the default database used by elastetic",
        author: "elastetic",
        version: "0.0.1",
        config:{
			partial: "partial template.html",
			code: ["partial_controller.js"]
		},
        icon: "/images/plugin_images/MongoDB_Gray_Logo_FullColor_RGB-01.jpg",
        license: "GPL-3.0",
		create: function(){ return new MongoDb();}
    };
}
module.exports = getPluginConfig;
```   