# database plugins

## main database
- The system needs to have a database plugin registered at installation.  This database is responsible for storing user, authentication, site, page, view, connection, function and plugin information.
- This will be populated with some initial values for the main site.
- The interface for database plugins needs to adhere to the following [interface](mongodb.md).

## external databases
The main database is generally not used to store measurement data from devices. Instead, this can be stored in your own or 3th party, external databases. These can be configured through a connection plugin.

Currently supported external database types:
- mysql (make certain it is version 5.7.8 or higher since it needs support for the json data type)

Note: the currently active database plugin should never be unloaded (removed) from the system. This causes a fatal crash.
