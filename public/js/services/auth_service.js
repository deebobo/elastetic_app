/**
 * Created by Deebobo.dev on 28/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict';


//see: http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.WSrRKGiGOHs
deebobo.factory('AuthService',
    ['$q', '$timeout', '$http',  function ($q, $timeout, $http) {

        var user = null;                                                // create user variable that stores the currently logged in user

        return ({                                                       // return available functions for use in controllers
            isLoggedIn: isLoggedIn,
            login: login,
            logout: logout,
            register: register
        });

        function isLoggedIn() {
            if(user == null){                                               //check if there is a cookie fo the token, if so, we are still logged in.
                user = getCookie('IWT') != null;
            }
            if(user) {
                return true;
            } else {
                return false;
            }
        }

        //note: email can be username or email address.
        function login(site, email, password) {
            var deferred = $q.defer();                                                  // create a new instance of deferred (do async call to server)
            $http.post('/api/site/' + site + '/login', {name: email, password: password})     // send a post request to the server
                .then(function (data) {                                      // handle success
                    if(data && data.status == 200){
                        user = true;
                        deferred.resolve();
                    } else {
                        user = false;
                        deferred.reject(data.data);
                    }
                },function (data) {                                                // handle error
                        user = false;
                        deferred.reject(data.data);
                    }
                );
            return deferred.promise;                                                    // return promise object for async call

        }

        function logout() {
            user = false;                                                                //the server is stateless, so don't need to send any commands to log out
            deleteCookie('IWT');                                                         //also remvoe the cookie that contains the token, otherwise we aren't logged out anymore on hte next run.
        }

        function register(site, username, email, password) {
            var deferred = $q.defer();
            $http.post('/api/site/' + site + '/register', {name: username, password: password, email: email})
                .then(function (data) {                                      // handle success
                    if(data && data.status === 200){
                        deferred.resolve();
                    } else {
                        deferred.reject(data.data);
                    }
                },
                    function (data) {                                                // handle error
                        deferred.reject(data.data);
                    });
            return deferred.promise;

        }
    }]
);