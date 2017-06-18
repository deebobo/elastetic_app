/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

deebobo.controller('EmailTemplatesController',
    ['$scope', 'messages', 
        function ($scope, messages) {

			
            //get data from site for scope
			//--------------------------------------------------------------------------------------
            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/templates/mail'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
                    $scope.templates = response.data;
                },
                function (response) {
                    messages.error(response.data);
                }
            );
			
			
			//html callbacks.
			//--------------------------------------------------------------------------------------
			$scope.submitEmailplugin = function(email){
				$http({method: 'PUT', url: '/api/site/' + $stateParams.site + '/templates/mail', data: email})      //get the list of groups that can view
				.then(function (response) {
						loadPluginSettings();
					},
					function (response) {
						messages.error(response.data);
					}
				);
			}
        }
    ]
);