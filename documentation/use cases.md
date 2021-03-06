#use cases

## site owner
As a site owner, I want to:
- install the application using the online interface (url: "\install") and see a default application
- for the standard track & trace template:
    - create a new site:
        - with new sitename, using track & trace template
        - with already used sitename should fail
        - with valid/invalid credentials (invalid should fail)
        - with valid/invalid particle.io credentials (invalid should fail)
        - with valid/invalid mysql credentials (invalid should fail)
    - change:
        - connection to particle with valid/invalid data
        - connection to db with valid/invalid data
- for the shared track & trace template:
	- create a new site:
		- with a new sitename
		- fail for already existing sittename
		- can't set credentials for db
		- can set credentials for particle.io
    - change:
    	- cant view current mysql db settings
    	- can change mysql db settings to private db
    	- can reassign db for table-connections to newly created db connection
- for all templates:
    - change: 
        - a function to store data from particle into db
        - groups
        - theming: change colors
        - add/remove groups that connections belong to.
    - add:
        - connection to particle with valid/invalid data
        - connection to db with valid/invalid data 
        - table-connections for history and poi
        - a function to store data from particle into db
        - groups
	
## regular user
As a user, I want to:
- create a new account on an existing site from:
	- from the global create-account location  {\login}
	- the site local 'create account view' (\{sitename}\login)
- not be able to create a new account on a non existing site
- log into:
	- an existing site, using valid credentials
- not be able to log into 
	- a non existing site
	- an existing site with invalid credentials
- can not change:
	- connection to particle with valid/invalid data
	- connection to db with valid/invalid data
	- a function to store data from particle into db
- can not add:
	- connection to particle with valid/invalid data
	- connection to db with valid/invalid data 
	- a function to store data from particle into db

## any user
- view the list of devices
- view the map with currently recorded routes 
	- upon opening should only view data of the last recorded day
	- filter data based on start and stop date/time
-browse to the following urls:
    - "/{sitename}": and go to the default page and view
    - "/{sitename}/{pagename}": and go to the requested page and default view
    - "/{sitename}/{pagename}/{viewname}": and go to the requested page and view
    - also accepts trailing "/" in url
- filter data with:
	- start date and time
	- end date and time
	- devices listed
- change the appearance of the routes:
	- line colors
	- show/hide lines vs points
	- click on a point and see the date & device

#track & trace use cases
- as a registered user, I can view all the routes and poi's
- as an editor, I can add/change remove markers (points of interests)
- as an administator, I can add a new connection and assign groups to that connection
- as a user, I can display the individual points and click on each point to see more details (duplicate)
- as a user I can click on a point of intererst and see more details


# future use case (not yet working)

## as a site owner, I can:
- pages:
	- add a new page
		- select the plugin
		- assign parameter values for plugin, like menu content (build a menu)
	- delete a page
	- set the default page
	- build a menu where some links refer to page 1 and others to page 2
- views
	- add a new view
		- select the plugin
		- assign parameter values for the plugin
		- create a menu item in a page that references this view 
    - delete a view
- client plugins for views, pages, functions
	- create and upload a plugin to main and self made sites
	- create a view/page/function with new plugin
	- use page/view from menu
	- use function in view
- server plugins for functions and connections
	- create and upload a plugin:
		- to main 
		- to self made sites should not be possible
	- create a view/page/function with new plugin from main and self made sites
	- use page/view from menu
	- use function in view
- export site as template
- use newly created template to create a new site

## as a regular user, I can:
- not export a site as a template
- not upload plugins of any kind

## as an editor, I can:
- change/create/delete views and pages I have access to (editor/view)
