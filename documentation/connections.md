#connections
A connection is a plugin that provides access to an external resource like databases or a cloud platform.

A connection usually consists out of a client and backend part.

## client
the client's responsibilities are:
- configuring the connection. The plugin usually contains a partial and javascript file for this operation.
These are used in the 'connections' adminstration section, and are loaded when the user creaetes a new connection and selects the plugin.

## backend
The backend section of a connection plugin is responsible for:
- providing access to the data. Some connections don't provide javascript libraries or don't allow cross domain requests, in which case data has to be requrested through the server.
Plugins that provide support for data storage and retrieval have to implement the following functions:
	- connect: create a connection to the resource
	- close: close the resource
	- queryHistory: return historical data
	- storeHistory: store historical data     
For more information, see [this interface](connections\my_sql_data_store.md)
- registering and unregistering callbacks: some connections allow data to be streamed. Currently, the backend only support http webhooks (callbacks) to perform this operation. If a connection plugin supports this feature, it has to implement a way to register and remove the callbacks. For more info, see [this interface](connections\particle_io.md)