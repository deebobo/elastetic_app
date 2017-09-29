/**
 * Created by elastetic.dev on 28/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict';


elastetic.factory('pageService',
    ['$q', '$http',  function ($q, $http) {

        return ({                                                       // return available functions for use in controllers
            get: get
        });


        /**
         * get the definition of a page. This is a record:
         * { partial: name and relative path of the html partial to use for this page,
         *   controller: path and name of javascript file that functions as the angular js controller of the partial
         * @param page {string} the name of the page to  get the definition of
         * @param site {string} the name of the site (can't use $stateParam cause this is still pointing to the old state)
         * @returns {Bluebird<R>}
         */
        function get(site, page){
            var deferred = $q.defer();
            $http.get('/api/site/' + site + '/page/' +  page)     // send a post request to the server
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