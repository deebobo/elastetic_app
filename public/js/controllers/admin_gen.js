'use strict'
/**
 * Created by elastetic.dev on 5/06/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict'
elastetic.controller('adminGeneralController',
    ['$scope', '$http', '$stateParams', 'messages', 'siteDetails', '$window', 'toolbar', 'colorsList',
        function ($scope, $http, $stateParams, messages, siteDetails, $window, toolbar, colorsList) {

			//scope vars
			//--------------------------------------------------------------------------------------
			$scope.skinNeedsSave = false;
			$scope.siteNeedsSave = false;
			$scope.site = siteDetails;							//site details comes from 'resolve' in ui-router (on app.js)
            toolbar.title = "general configuration";
            toolbar.buttons = [];

			
			$http({method: 'GET', url: encodeURI('/api/site/' + $stateParams.site + '/page')})      //get the list of pages
            .then(function (response) {
                    $scope.pages = response.data;
                },
                function (response) {
                    messages.error(response.data);
                }
            );

            $http({method: 'GET', url: encodeURI('/api/site/' + $stateParams.site + '/view')})      //get the list of views
                .then(function (response) {
                        $scope.views = response.data;
                    },
                    function (response) {
                        messages.error(response.data);
                    }
                );
			
			$http({method: 'GET', url: encodeURI('/api/site/' + $stateParams.site + '/group/view')})      //get the list of groups that can view
            .then(function (response) {
                    $scope.viewGroups = response.data;
                },
                function (response) {
                    messages.error(response.data);
                }
            );
			
		/*	$http({method: 'GET', url: encodeURI('/api/site/' + $stateParams.site + '/skin')})      //get the list of available/known skins
            .then(function (response) {
                    //$scope.skins = response.data;
                },
                function (response) {
                    messages.error(response.data);
                }
            );
		*/
			
			//html callbacks.
			//--------------------------------------------------------------------------------------
			$scope.submitSiteDetails = function(site){
				$http({method: 'PUT', url: encodeURI('/api/site/' + $stateParams.site), data: site})      //get the list of groups that can view
				.then(function (response) {
						$scope.siteNeedsSave = false;
                        $window.location.reload();
					},
					function (response) {
						messages.error(response.data);
					}
				);
			};


			//__________________________________________________________________________________________________
			//themes
			//__________________________________________________________________________________________________

			$scope.colors = colorsList.colors;

			

			
        }
    ]
);