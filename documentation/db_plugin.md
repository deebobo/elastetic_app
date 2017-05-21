# database plugins

The interface for database plugins should contain the following features:

- constructor(): (a regular function or constructor on a class) this takes no parameters. This function is called with the new operator to create an object that represents the database. The function shouldn't do much more but set up an empty, not connected database.
- connect(): create a connection with the database. The objects should retrieve connection information from config.js (found in the root of the api).
Returns true upon success, othewise false.
- createDb(): create the database with all the required [collections/tables](#tables). This function should raise an exception if something went wrong.
- addUser(user): add a new user to the  
The admin parameter is an object with the following fields:
	- name: the name of the admin user. 
	- email: the email address of the admin user
	- password: a hash value of the password for the user.
	- group: the group to which this user belongs


# tables
The createDb function should create the following tables/collections:

## users
- fields:
	- _id: the id of the user
	- name: the name of the admin user. 
	- email: the email address of the admin user
	- password: a hash value of the password for the user.
	- site: the name of the site that this user is registered on
	- group: the id of the group that it belongs too.
- keys: (unique) email - site

## groups
- fields:
	- name: the name of the group 
	- level: the access level of the group. Currently supported values:
		- admin: full access
		- edit: can edit the views to which this group is assigned.
		- view: can access the views to which this group is assigned, but can't change it.
		- public: allows for unregistered users to access the view
- keys: name


Note: the currently active database plugin should never be unloaded (removed) from the system. This causes a fatal crash.