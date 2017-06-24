/**
 * Created by Deebobo.dev on 28/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict';


//see: http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.WSrRKGiGOHs
deebobo.factory('siteService',
    ['$q', '$http',  function ($q, $http) {

        return ({                                                       // return available functions for use in controllers
            create: create,
            get: get
        });


        function create(sitename, adminname, adminEmail, password){
            var deferred = $q.defer();                                                  // create a new instance of deferred
            $http.post('/api/site', {site: sitename, name: adminname, password: password, email: adminEmail})
                .then(function (data) {                                      // handle success
                    if(data && data.status == 200){
                        deferred.resolve();
                    } else {
                        deferred.reject(data.data);
                    }
                },function (data) {                                                // handle error
                        deferred.reject(data.data);
                    }
                );
            return deferred.promise;
        }

        /**
         * get the definition/details of the current site.
         * note: can't inject stateparams into the service, need to use a parameter, cause it will be an incorrect
         * reference.
         * @returns {Bluebird<R>}
         */
        function get(stateParams){
            var deferred = $q.defer();
            $http.get('/api/site/' + stateParams.site )     // send a post request to the server
                .then(function (data) {                                      // handle success
                        //controller file should still be loaded dynamically (if not yet done)
                        if(data && data.status == 200){
                            deferred.resolve(data.data);
                        } else {
                            deferred.reject(data.data);
                        }
                    },function (data) {                                                // handle error
                        deferred.reject(data.data);
                    }
                );
            return deferred.promise;
        }
    }]
);