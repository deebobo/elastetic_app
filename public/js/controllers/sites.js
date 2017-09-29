/**
 * Created by elastetic.dev on 3/06/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict'
elastetic.controller('sitesController', ['$scope', '$location', 'siteService', '$http','messages', '$q',
    function ($scope, $location, siteService, $http, messages, $q) {

        $scope.toConfigure = [];                          //a list of plugins that needs to be configured for the selected site templae
        $scope.plugins = null;                            //all the globally known plugins


        $http({method: 'GET', url: '/api/site'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
                    $scope.sites = response.data
                },
                function (response) {
					messages.error(response.data);
                }
                );

        $http({method: 'GET', url: '/api/site/templates'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
                    $scope.templates = response.data
                },
                function (response) {
                    messages.error(response.data);
                }
            );

        /**gets all the plugins that are globally available. This allows the 'templateChanged' function
         * to filter on this list.
        */
        function getPlugins(template){
            var deferred = $q.defer();
            if( $scope.plugins)
                deferred.resolve($scope.plugins);
            else{
                $http({method: 'GET', url: '/api/site/templates/' + template })      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
                    .then(function (response) {
                            deferred.resolve(response.data);
                        },
                        function (response) {
                            deferred.reject(response.data);
                        }
                    );
            }
            return deferred.promise;
        }

        $scope.createsite = function () {

            if($scope.createForm.password !== $scope.createForm.password2){
                $scope.error = false;
                $scope.disabled = true;
                $scope.errorMessage = "passwords don't match";
            }
            else{
                // initial values
                $scope.error = false;
                $scope.disabled = true;

                //make a copy of the template config params, cause each object has too many fields, that we don't want to send over again.
                var toConfigure = []
                for(var i = 0; i < $scope.toConfigure.length; i++){
                    var item = $scope.toConfigure[i];
                    toConfigure.push({ item: item.item.value.name, data: item.content, plugin: item.plugin  });
                }
                // call login from service
                siteService.create($scope.createForm.sitename, $scope.createForm.username, $scope.createForm.email, $scope.createForm.password, $scope.createForm.template.name, toConfigure)
                // handle success
                    .then(function () {
                        $location.path('/' + $scope.createForm.sitename + "/login");
                        $scope.disabled = false;
                    })
                    // handle error
                    .catch(function (err) {
                        $scope.error = true;
                        if(err)
                            $scope.errorMessage = err;
                        else
                            $scope.errorMessage = "unknown error";
                        $scope.disabled = false;
                    });
            }

        };

        $scope.templateChanged = function(){
            $scope.toConfigure = [];                                                    //reset this list.
            getPlugins($scope.createForm.template).then((plugins) =>{
                for(var i = 0; i < $scope.createForm.template.definition.length; i++){
                    var item = $scope.createForm.template.definition[i];
                    var plugin = null;
                    if(item.value.plugin)
                        plugin = item.value.plugin;
                    else if(item.value.source)
                        plugin = item.value.source;
                    if(plugin && plugin.showConfig){
                        var toConfig = { item: item };
                        if(plugin.name)
                            toConfig.plugins = plugins.filter((value) => {return value.name === plugin.name && value.type === item.type});
                        else
                            toConfig.plugins = plugins.filter((value) => {return value.type === item.type});
                        $scope.toConfigure.push(toConfig);

                    }
                }
            });
        };

    }]
);