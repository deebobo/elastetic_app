# application structure
A elastetic application uses a layered structure that is reflected in the URL's.

## sites
At the top level, the application is divided into sites. Each user is always registered to a single site. To gain access to a site, you need to register or be invited to the site.

## pages
A page determines the layout structure of the application.  Usually, this defines a menu.   
Every site needs at least 1 page: for the homepage, but you can build as many sites as you want, so you can change the experience depending on the resource being accessed or the user accessing it.

## views
Within each page, menu items can display views.  A view usually contains a collection of data and is diplayed in the main editing area.
Using the page-view approach, the application's menu and bar don't have to be reloaded every time that the view changes, only the relevant part is updated.  
This also allows for different pages working with the same views (ex: the menu is different depending on the user).

## details
A view can still display many data points. Sometimes a detailed view is required, like in a master-detail view. For this reason, each view can also lead to 1 or more details. A detail can be depicted as a new view within the page or as a popup.

## connections
A connectin is a system configuration that provides access to an external resource such as a database or cloud platform.  
Connections can be used by the views to retrieve or send data to/from. they are also used by the functions as inputs and outputs.
See [connections](connections.md) for more info

ex: a connection to particle.io, mysql or azure iot hub.

## functions
A function is a server side task that can run continuously in the background or that can be triggered with an api call. Typical usage for functions are:
- push data from 1 connection to another
- calculate metrics and store them in a connection
- ...
For more info, see [functions](functions.md)