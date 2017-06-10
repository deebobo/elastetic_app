# application structure
A deebobo application uses a layered structure that is reflected in the URL's.

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