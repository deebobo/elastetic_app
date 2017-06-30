/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

deebobo.controller('AdminEmailController',
    ['$scope', 'messages', 'pluginService', '$http', '$stateParams', '$mdDialog',
        function ($scope, messages, pluginService, $http, $stateParams, $mdDialog) {

			//helper functions
			//--------------------------------------------------------------------------------------
			function loadPluginSettings(pluginName){
				$scope.plugin = pluginName;
				if(pluginName){
					$http({method: 'GET', url: '/api/site/' + $stateParams.site + "/plugin/" + pluginName})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
					.then(function (response) {
							if(response.data.config && response.data.config.scripts) {
                                pluginService.load(response.data.config.scripts).then(function () {
                                        $scope.emailConfigPartial = "plugins/" + response.data.config.partials[0];
                                    },
                                    function () {
                                        messages.error("failed to load scripts for plugin: " + pluginName);
                                    }
                                );
                            }
						},
						function (response) {
							messages.error(response.data);
						}
					);
				}
				else{
					$scope.emailConfigPartial = "";
				}
				
			}
		
			
            //get data from site for scope
			//--------------------------------------------------------------------------------------
            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/plugin/mail'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
					$scope.emailPlugins = response.data;
                },
                function (response) {
                    messages.error(response.data);
                }
            );
			
			
			$http({method: 'GET', url: '/api/site/' + $stateParams.site })      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
                    loadPluginSettings(response.data);
                },
                function (response) {
                    messages.error(response.data);
                }
            );
			
			
			//html callbacks.
			//--------------------------------------------------------------------------------------
			$scope.selectEmailplugin = function(email){
				$http({method: 'PUT', url: '/api/site/' + $stateParams.site + '/plugin/mail/default', data: email})      //get the list of groups that can view
				.then(function (response) {
						loadPluginSettings(email);
					},
					function (response) {
						messages.error(response.data);
					}
				);
			}


            //scope vars
            //--------------------------------------------------------------------------------------

            $scope.templates = [];

            //get data from site for scope
            //--------------------------------------------------------------------------------------
            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/templates/email'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
                .then(function (response) {
                        $scope.templates.push.apply($scope.templates, response.data);
                    },
                    function (response) {
                        messages.error(response.data);
                    }
                );


            //html callbacks.
            //--------------------------------------------------------------------------------------

            $scope.addTemplate = function(){
                $scope.templates.push({name: "new template", isOpen: true, needsSave: true, isNew: true});
            }

            $scope.saveTemplate = function(template){
                if(template.isNew){
                    $http({method: 'POST', url: '/api/site/' + $stateParams.site + '/templates/email', data: template})      //get the list of groups that can view
                        .then(function (response) {
                                template.isNew = false;
                                template.needsSave = false;
                            },
                            function (response) {
                                messages.error(response.data);
                            }
                        );

                }
                else{
                    $http({method: 'PUT', url: '/api/site/' + $stateParams.site + '/templates/email/' + template._id, data: template})      //get the list of groups that can view
                        .then(function (response) {
                                template.needsSave = false;
                            },
                            function (response) {
                                messages.error(response.data);
                            }
                        );
                }
            }

            $scope.delete = function(connection, ev) {

                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Delete')
                    .textContent('Are you certain you want to delete this template?.')
                    .ariaLabel('delete')
                    .targetEvent(ev)
                    .ok('yes')
                    .cancel('no');

                $mdDialog.show(confirm).then(function () {
                    if (!connection.isNew) {                                                  //its a real record, needs to be deleted from the server.
                        $http({method: 'DELETE', url: '/api/site/' + $stateParams.site + '/templates/' + template._id})      //get the list of groups that can view
                            .then(function (response) {
                                    $scope.templates.splice($scope.connections.indexOf(template), 1);
                                },
                                function (response) {
                                    messages.error(response.data);
                                }
                            );
                    }
                    else
                        $scope.connections.splice($scope.connections.indexOf(connection), 1);

                }, function () {
                    //$scope.status = 'You decided to keep your debt.';
                });
            }

        }
    ]
);