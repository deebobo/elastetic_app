# authentication

- the system uses [JWT (json web tokens)](https://jwt.io/) to authenticate all api calls.
- A token is returned to the user upon logging into the system.
- the server backend is stateless: no session is kept on the server side.
- The system is able to accept a jwt token through
	- a cookie: savest for web browsers
	- a http header: for mobile and callbacks