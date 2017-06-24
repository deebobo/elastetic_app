/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

deebobo.controller('AdminEmailController',
    ['$scope', 'messages', 'pluginService',
        function ($scope, messages, pluginService) {

			//helper functions
			//--------------------------------------------------------------------------------------
			function loadPluginSettings(pluginName){
				$scope.plugin = pluginName;
				if(pluginName){
					$http({method: 'GET', url: '/api/site/' + $stateParams.site + "/plugin/" + pluginName})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
					.then(function (response) {
							pluginService.load(response.data.config.scripts).
							then(function(){ $scope.emailConfigPartial = "plugins/" + response.data.config.partials[0];},
								 function(){ messages.error("failed to load scripts for plugin: " + pluginName); }
							);
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
			
			$scope.addTemplate = function(){
				var confirm = $mdDialog.prompt()
				  .title('Add new template')
				  .textContent('What is the name of the template?')
				  .placeholder('name')
				  .ariaLabel('name')
				  .initialValue('')
				  .targetEvent(ev)
				  .ok('ok')
				  .cancel('cancel');

				$mdDialog.show(confirm).then(function(result) {
					$http({method: 'POST', url: '/api/site/' + $stateParams.site + '/templates/email', data: {"name": result }})      //get the list of groups that can view
					.then(function (response) {
						},
						function (response) {
							messages.error(response.data);
						}
					);
				}, function() {
					messages.error(response.data);
				});
			}
        }
    ]
);