/**
 * Created by elastetic.dev on 5/06/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict'

elastetic.controller('adminConnectionsController',
    ['$scope', '$http', 'messages', '$stateParams', '$mdDialog', 'pluginService', '$q', 'toolbar', 'Group',
        function ($scope, $http, messages, $stateParams, $mdDialog, pluginService, $q, toolbar, Group) {

            //scope vars
            //--------------------------------------------------------------------------------------

            var scope = $scope;

            toolbar.title = "connections";
            toolbar.buttons = [
                {   tooltip: "add a new connection",
                    icon: "fa fa-plus-circle",
                    type: "font-icon",
                    click: function(ev){ scope.addConnection();}
                }
            ];

            scope.connections = [];
			scope.groups = Group.query({site: $stateParams.site});

            /**
             * if both the record list and the plugins exist, convert the objects of the recs to the objects
             * of the plugins, so that the selects can work properly.
             * @param recs
             * @param plugins
             */
            function tryConvertPluginRefs(recs, plugins){
                var deferred = $q.defer();
                if(recs && plugins) {
                    var promises = [];
                    for (var i = 0; i < recs.length; i++) {
                        if(recs[i].plugin){
                            recs[i].template = "plugins/" + recs[i].plugin.config.partials[0];
                            recs[i].plugin = plugins.find(function(x){ return x._id === recs[i].plugin._id; });
                            promises.push(pluginService.load(recs[i].plugin.config));
                        }
                    }
                    $q.all(promises).then(function() {
                        deferred.resolve();
                    });
                }
                else
                    deferred.resolve();
                return deferred.promise;
            }

            function tryConvertPluginRef(rec, plugins){
                var deferred = $q.defer();
                if(rec && plugins) {
                    if(rec.plugin){
                        rec.template = "plugins/" + rec.plugin.config.partials[0];
                        rec.plugin = plugins.find(function(x){ return x._id === rec.plugin._id; });
                        pluginService.load(rec.plugin.config).then(function() {
                            deferred.resolve();
                        });
                    }
                }
                else
                    deferred.resolve();
                return deferred.promise;
            }

            //get data from site for scope
            //--------------------------------------------------------------------------------------
            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/connection'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
                .then(function (response) {
                        tryConvertPluginRefs(response.data, scope.connectionPlugins).then(function(){
                            scope.connections.push.apply(scope.connections, response.data);
                        });
                    },
                    function (response) {
                        messages.error(response.data);
                    }
                );

            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/plugin/connection'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
                .then(function (response) {
                        tryConvertPluginRefs(scope.connections, response.data).then(function(){
                            scope.connectionPlugins = response.data;
                        });
                    },
                    function (response) {
                        messages.error(response.data);
                    }
                );


            //html callbacks.
            //--------------------------------------------------------------------------------------
            scope.addConnection = function(){
                scope.connections.push({name: "new connection", plugin: null, isOpen: true, needsSave: true, isNew: true, groups: scope.groups.slice()});   //copy the grups list to give default access to everyone.
            };

            /* now done by pluginConfigurator directive
           scope.pluginChanged = function(connection){
                if(connection.plugin.config){
                    pluginService.load(connection.plugin.config)
                        .then(function(){
                            connection.needsSave = true;
                            connection.template = "plugins/" + connection.plugin.config.partials[0];

                        });
                }
            };*/

            scope.save = function(connection){
                if(connection.isNew === true){
                    $http({method: 'POST', url: '/api/site/' + $stateParams.site + '/connection', data: connection})      //get the list of groups that can view
                        .then(function (response) {
                                angular.copy(response.data, connection);      //make a copy so we have the id and possibly other values that were generated (ex: token for particle)
                                tryConvertPluginRef(connection, scope.connectionPlugins);
                                connection.needsSave = false;
                                connection.isNew = false;
                            },
                            function (response) {
                                messages.error(response.data);
                            }
                        );
                }
                else {
                    $http({method: 'PUT', url: '/api/site/' + $stateParams.site + '/connection/' + connection._id, data: connection})      //get the list of groups that can view
                        .then(function (response) {
                                angular.copy(response.data, connection);      //make a copy so we have the id and possibly other values that were generated (ex: token for particle)
                                tryConvertPluginRef(connection, scope.connectionPlugins);
                                connection.needsSave = false;
                            },
                            function (response) {
                                messages.error(response.data);
                            }
                        );
                }
            };

            scope.delete = function(connection, ev){

                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Delete')
                    .textContent('Are you certain you want to delete this connection?.')
                    .ariaLabel('delete')
                    .targetEvent(ev)
                    .ok('yes')
                    .cancel('no');

                $mdDialog.show(confirm).then(function() {
                    if( !connection.isNew ){                                                  //its a real record, needs to be deleted from the server.
                        $http({method: 'DELETE', url: '/api/site/' + $stateParams.site + '/connection/' + connection._id})      //get the list of groups that can view
                            .then(function (response) {
                                    $scope.connections.splice($scope.connections.indexOf(connection), 1);
                                },
                                function (response) {
                                    messages.error(response.data);
                                }
                            );
                    }
                    else
                        $scope.connections.splice($scope.connections.indexOf(connection), 1);

                }, function() {
                    //$scope.status = 'You decided to keep your debt.';
                });


            };


            /**
             * refreshes the token for the connection. Only available if the record had already been saved.
             * @param value
             */
            scope.refresh_token = function(connection, ev){
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Refresh token')
                    .textContent('Are you certain you want to renew the token for this connection (callbacks will be recreated)?')
                    .ariaLabel('Refresh token')
                    .targetEvent(ev)
                    .ok('yes')
                    .cancel('no');

                $mdDialog.show(confirm).then(function() {
                    if( !connection.isNew ){                                                  //its a real record, needs to be deleted from the server.
                        $http({method: 'POST', url: '/api/site/' + $stateParams.site + '/connection/' + connection._id + "/refreshtoken"})      //get the list of groups that can view
                            .then(function (response) {
                                    connection.content.authToken = response.data.content.authToken;
                                    connection.warning = response.data.warning;
                                },
                                function (response) {
                                    messages.error(response.data);
                                }
                            );
                    }
                    else
                        scope.connections.splice(scope.connections.indexOf(connection), 1);

                }, function() {
                    //scope.status = 'You decided to keep your debt.';
                });
            };
			
			scope.checkGroupChip = function(connection, chip){
			    if(chip){
			        if(typeof chip === "object")
			            return chip;
			        var found = scope.groups.find((item) =>{return item.name == chip} );
			        if(found)
			            return found;
                }
                return null;
            };
			
			scope.groupAddedTo = function(connection, chip){
				//connection.groups.push(chip);
				connection.needsSave = true;
			};
			
			$scope.groupRemovedFrom = function(connection, chip){
				connection.needsSave = true;
			}

        }
    ]
);
