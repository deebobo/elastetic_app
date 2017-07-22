/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

deebobo.controller('adminConnectionsController',
    ['$scope', '$http', 'messages', '$stateParams', '$mdDialog', 'pluginService', '$q',
        function ($scope, $http, messages, $stateParams, $mdDialog, pluginService, $q) {

            //scope vars
            //--------------------------------------------------------------------------------------

            $scope.connections = [];

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
                    for (i = 0; i < recs.length; i++) {
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

            //get data from site for scope
            //--------------------------------------------------------------------------------------
            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/connection'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
                .then(function (response) {
                        tryConvertPluginRefs(response.data, $scope.connectionPlugins).then(function(){
                            $scope.connections.push.apply($scope.connections, response.data);
                        });
                    },
                    function (response) {
                        messages.error(response.data);
                    }
                );

            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/plugin/connection'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
                .then(function (response) {
                        tryConvertPluginRefs($scope.connections, response.data).then(function(){
                            $scope.connectionPlugins = response.data;
                        });
                    },
                    function (response) {
                        messages.error(response.data);
                    }
                );


            //html callbacks.
            //--------------------------------------------------------------------------------------
            $scope.addConnection = function(){
                $scope.connections.push({name: "new connection", plugin: null, isOpen: true, needsSave: true, isNew: true});
            };

            /* now done by pluginConfigurator directive
           $scope.pluginChanged = function(connection){
                if(connection.plugin.config){
                    pluginService.load(connection.plugin.config)
                        .then(function(){
                            connection.needsSave = true;
                            connection.template = "plugins/" + connection.plugin.config.partials[0];

                        });
                }
            };*/

            $scope.save = function(connection){
                if(connection.isNew === true){
                    $http({method: 'POST', url: '/api/site/' + $stateParams.site + '/connection', data: connection})      //get the list of groups that can view
                        .then(function (response) {
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
                                connection.needsSave = false;
                            },
                            function (response) {
                                messages.error(response.data);
                            }
                        );
                }
            };

            $scope.delete = function(connection, ev){

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

        }
    ]
);
