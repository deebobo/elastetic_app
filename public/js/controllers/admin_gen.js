'use strict'
/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict'
deebobo.controller('adminGeneralController',
    ['$scope', '$http', '$stateParams', 'messages', 'siteDetails', '$window',
        function ($scope, $http, $stateParams, messages, siteDetails, $window) {

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

            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/view'})      //get the list of views
                .then(function (response) {
                        $scope.views = response.data;
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
			
		/*	$http({method: 'GET', url: '/api/site/' + $stateParams.site + '/skin'})      //get the list of available/known skins
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
				$http({method: 'PUT', url: '/api/site/' + $stateParams.site, data: site})      //get the list of groups that can view
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

			$scope.colors = [
				{name: "red", color: "#F44336"},
                {name: "pink", color: "#E91E63"},
                {name: "purple", color: "#9C27B0"},
                {name: "deep-purple", color: "#673AB7"},
                {name: "indigo", color: "#3F51B5"},
                {name: "blue", color: "#2196F3"},
                {name: "light-blue", color: "#03A9F4"},
                {name: "cyan", color: "#00BCD4"},
                {name: "teal", color: "#009688"},
                {name: "green", color: "#4CAF50"},
                {name: "light-green", color: "#8BC34A"},
                {name: "lime", color: "#CDDC39"},
                {name: "yellow", color: "#FFEB3B"},
                {name: "amber", color: "#FFC107"},
                {name: "orange", color: "#FF9800"},
                {name: "deep-orange", color: "#FF5722"},
                {name: "brown", color: "#795548"},
                {name: "grey", color: "#9E9E9E"},
                {name: "blue-grey", color: "#607D8B"},
                {name: "white", color: "#FFFFFF"},
                {name: "black", color: "#000000"}
			];

			

			
        }
    ]
);