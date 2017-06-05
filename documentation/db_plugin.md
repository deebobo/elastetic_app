# database plugins

- The system needs to have a database plugin registered at installation. This will be populated with some initial values such as the global admin user account, initial groups and the default email service.
- The interface for database plugins needs to adhere to the following [interface](mongodb.md).



Note: the currently active database plugin should never be unloaded (removed) from the system. This causes a fatal crash.