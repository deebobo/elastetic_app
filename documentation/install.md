# Instalation guide

## for stand alone deployments
For this type of installation procedure, the application must be able to permanently write to disk (a config file is generated).

- install deebobo application, run: `npm install` from inside the app\api\bin directory
- to set up the application and database, use one of the following options:
	- run install_db.js to initialize the db from inside the app\api directory
	- browse to '\install' and provide all the parameters through a web interface.

## docker type of installations
Some deployement types, like on heroku or in docker containers, don't allow for the application to store a config file. On the next run, these settings will be lost.  
For this reason, the system can also work with an enviroment variable to pass in the configuration values. An installation is still required to create and populate the database, but the parameters will be passed into the application through the enviroment and not a config file.

### To install to heroku:

- load your application into heroku
- set up a mongo database
- set up the following environment variables in heroku:
  - db: mongodb
  - db_connection_string: the uri to your mongodb
  - secret: your_secret_key
  - expires: nr_of_days_token_validity
- browse to '\install' and provide the missing parameters through the web interface.
