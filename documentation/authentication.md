# authentication

- the system uses [JWT (json web tokens)](https://jwt.io/) to authenticate all api calls.
- A token is returned to the user upon logging into the system.
- the server backend is stateless: no session is kept on the server side.
- to allow users to remain logged in over multiple sessions, the JWT is stored in a cookie. 