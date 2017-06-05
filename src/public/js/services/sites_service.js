/**
 * Created by Deebobo.dev on 28/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict';


//see: http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack/#.WSrRKGiGOHs
deebobo.factory('sitesService',
    ['$q', '$timeout', '$http',  function ($q, $timeout, $http) {

        return ({                                                       // return available functions for use in controllers
            create: create
        });


        function create(sitename, adminname, adminEmail, password){
            var deferred = $q.defer();                                                  // create a new instance of deferred
            $http.post('/api/sites', {site: sitename, name: adminname, password: password, email: adminEmail})
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
    }]
);