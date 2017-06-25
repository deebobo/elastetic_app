/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

deebobo.controller('adminGeneralController',
    ['$scope', '$http', '$stateParams', 'messages', 'siteDetails',
        function ($scope, $http, $stateParams, messages, siteDetails) {

			//scope vars
			//--------------------------------------------------------------------------------------
			$scope.skinNeedsSave = false;
			$scope.siteNeedsSave = false;
			$scope.site = siteDetails;							//site details comes from 'resolve' in ui-router (on app.js)

			
			$http({method: 'GET', url: '/api/site/' + $stateParams.site + '/page'})      //get the list of pages
            .then(function (response) {
                    $scope.pages = response.data;
                },
                function (response) {
                    messages.error(response.data);
                }
            );
			
			$http({method: 'GET', url: '/api/site/' + $stateParams.site + '/group/view'})      //get the list of groups that can view
            .then(function (response) {
                    $scope.viewGroups = response.data;
                },
                function (response) {
                    messages.error(response.data);
                }
            );
			
			$http({method: 'GET', url: '/api/site/' + $stateParams.site + '/skin'})      //get the list of available/known skins
            .then(function (response) {
                    //$scope.skins = response.data;
                },
                function (response) {
                    messages.error(response.data);
                }
            );
			
			
			//html callbacks.
			//--------------------------------------------------------------------------------------
			$scope.submitSiteDetails = function(site){
				$http({method: 'PUT', url: '/api/site/' + $stateParams.site, data: site})      //get the list of groups that can view
				.then(function (response) {
						$scope.siteNeedsSave = false;
					},
					function (response) {
						messages.error(response.data);
					}
				);
			}
			
			$scope.submitAppearance = function(skin){
				$http({method: 'PUT', url: '/api/site/' + $stateParams.site + '/skin', data: skin})      //get the list of groups that can view
				.then(function (response) {
						$scope.skinNeedsSave = false;
					},
					function (response) {
						messages.error(response.data);
					}
				);
			}
			
			$scope.upload = function(){
				//todo: upload a skin
			}
			
        }
    ]
);