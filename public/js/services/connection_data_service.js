/**
 * Created by elastetic.dev on 28/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict';


/**
 * a service that provides access to data stored by a connection. It queries the connection through the elastetic api server.
 */
elastetic.factory('connectionDataService',
    ['$q', '$http', '$stateParams', function ($q, $http, $stateParams) {

        return ({                                                       // return available functions for use in controllers
            get: get,
            update: update,
            post: create,
            getTimeRange: getTimeRange
        });


        /**
         * get the data of a connection. 
         * @param connectionId {String} the id of the connection to get the data for.
         * @param options {Object} filter options to use.
         * Possible fields for historical data:
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
		
		/*updates a record for the specified connection.
		* @param data {Object} the record to update.
		*/
		function update(connectionId, data){
            var deferred = $q.defer();
            $http(  {url: '/api/site/' + $stateParams.site + '/connection/' +  connectionId + '/data/' + data.id,
                data: data,
                method: "PUT"
            })     // send a post request to the server
                .then(function (data) {                                      // handle success
                        //controller file should still be loaded dynamically (if not yet done)
                        if(data && data.status == 200){
                            deferred.resolve(data.data);
                        } else {
                            deferred.reject(data.message);
                        }
                    },function (data) {                                                // handle error
                        deferred.reject(data.message);
                    }
                );
            return deferred.promise;
		}


        function create(connectionId, data){
            var deferred = $q.defer();
            $http(  {url: '/api/site/' + $stateParams.site + '/connection/' +  connectionId + '/data',
                data: data,
                method: "POST"
            })     // send a post request to the server
                .then(function (data) {                                      // handle success
                        //controller file should still be loaded dynamically (if not yet done)
                        if(data && data.status == 200){
                            deferred.resolve(data.data);
                        } else {
                            deferred.reject(data.message);
                        }
                    },function (data) {                                                // handle error
                        deferred.reject(data.data.message);
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
		
		function getReportData(connectionId, queryDef){
            var deferred = $q.defer();
            $http(  {url: '/api/site/' + $stateParams.site + '/connection/' +  connectionId + '/data/report',
                method: "GET",
                data: queryDef
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