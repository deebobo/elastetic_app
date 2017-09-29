/**
 * Created by elastetic.dev on 28/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict';


elastetic.factory('viewService',
    ['$q', '$http',  function ($q, $http) {

        return ({                                                       // return available functions for use in controllers
            get: get
        });


        /**
         * get the definition of a view. This is a data record that defines partial and controller
         * @param page {string} the name of the view to  get the definition of
         * @param site {string} the name of the site (can't use $stateParam cause this is still pointing to the old state)
         * @returns {Bluebird<R>}
         */
        function get(site, view){
            var deferred = $q.defer();
            $http.get('/api/site/' + site + '/view/' +  view)     // send a post request to the server
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