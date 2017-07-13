#Creating pages and views

Creating pages and views is almost an identical process. The procedure is as follows:

- create or select the plugin that will drive the page/view
- upload the plugin (if not yet available on your site)
- create a new page/view on your site
- assign the plugin to the page/view
- declare the configuration values used by the plugin.

## the plugin
Every page or view is driven by a plugin. Plugins are always of a specific type, in this case either a page or view type, which is usualy a client side only plugin.
The plugin consists out of the following elements:
- 1 or more angular html partials that declare how the page/view will look like. At least 1 partial is the 'template' of the plugin, it's up to the page/view to determine which partial will be used for the actual template.
- 0, 1 or more javascript modules. Usually, they contain the controller code that goes with the partials, but they can also contain services, resources directives or any other type of angular module.
- 0, 1 or more css files to accompany the partials which allow you to style the page/view.

html, js and css files are always loaded into the client on an 'as-needed' basis. Only when a page/view is being accessed, will the system make certain that everything is loaded and not before. 
This allows you to create extremely big sites with many pages, whithout effecting the initial load-time of the application

## upload
Before you can use your plugins, they must be packaged and uploaded to the server. For more info, see [plugins](plugins.md)

## creating a page or view
comming soon