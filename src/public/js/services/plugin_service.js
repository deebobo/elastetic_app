/**
 * Created by Deebobo.dev on 9/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict';


deebobo.factory('pluginService',
    ['$q', '$stateParams',  function ($q,  $stateParams) {

        var plugins = {};                                               //stores all the already loaded js scripts.

        return ({                                                       // return available functions for use in controllers
            load: load
        });


        /**
         * make certain that the source file is loaded.
         * @param path {string} the path and name of the js file to load. The path is a relative path to the public section of the application.
         * @returns {Bluebird<R>}
         */
        function load(path){
            if(path in plugins)
                return plugins[path].promise;
            else {
                var deferred = $q.defer();
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = url;

                // Then bind the event to the callback function.
                // There are several events for cross browser compatibility.
                script.onreadystatechange = function(){deferred.resolve();};
                script.onload = function() {deferred.resolve();};
                head.appendChild(script);                       // Fire the loading

                plugins[path] = deferred;
                return deferred.promise;
            }
        }
    }]
);