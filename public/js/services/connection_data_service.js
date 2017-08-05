/**
 * Created by Deebobo.dev on 28/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict';


/**
 * a service that provides access to data stored by a connection. It queries the connection through the deebobo api server.
 */
deebobo.factory('connectionDataService',
    ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {

        return ({                                                       // return available functions for use in controllers
            get: get,
            getTimeRange: getTimeRange
        });


        /**
         * get the definition of a page. This is a record:
         * { partial: name and relative path of the html partial to use for this page,
         *   controller: path and name of javascript file that functions as the angular js controller of the partial
         * @param connectionId {String} the id of the connection to get the data for.
         * @param options {Object} filter options to use.
         * Possible fields:
         * - from
         * - to
         * - page
         * - pagesize
         * - device
         * - field
         * - source (id of connection that produced the data, ex: particle.io)
         * @returns {Bluebird<R>}
         */
        function get(connectionId, options){
            var deferred = $q.defer();
            $http(  {url: '/api/site/' + $stateParams.site + '/connection/' +  connectionId + '/data',
                     method: "GET",
                     params: options
                    })     // send a post request to the server
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

        function getTimeRange(connectionId, options){
            var deferred = $q.defer();
            $http(  {url: '/api/site/' + $stateParams.site + '/connection/' +  connectionId + '/data/timerange',
                method: "GET",
                params: options
            })     // send a post request to the server
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