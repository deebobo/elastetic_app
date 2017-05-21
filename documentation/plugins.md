# plugins

- all plugins have to implement a function called 'getPluginType' which should return an object with the following fields: 
	- create: a reference to the function (or class) that creates a new plugin
	- name: the name of the plugin. this is used to identify the plugin in various places like the config file for the db or in views for controls and such.
	- category: the category of the plugin. current categories are:
		- db
	- title: a short description (1 line) of the plugin
	- description: (optional) a long description for the plugin
	- author: (optional) the name of the author
	- version: (optional) the version nr of the plugin
	- icon: (optional) an URI to the icon for the plugin
	- license: (optional) the license of the plugin
The plugin module has to export this function. 

Example:

```
function getPluginType(){
    return {
        name: "mongodb",
        category: "db",
        title: "store the data in a mongo database",
        description: "this is the default database used by deebobo",
        author: "DeeBobo",
        version: "0.0.1",
        icon: "/images/plugin_images/MongoDB_Gray_Logo_FullColor_RGB-01.jpg",
        license: "GPL-3.0",
		create: MongoDb
    };
}
module.exports = getPluginType;
```   