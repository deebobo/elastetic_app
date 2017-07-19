/**
 * Created by Deebobo.dev on 1/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */


angular.module("deebobo").controller('privateMailerConfigController',
    ['$scope', '$controller', 'messages', '$http', '$stateParams',
    function($scope, $controller, messages, $http, $stateParams) {
    
    $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/data/private%20mail'})      //get the list of plugins for this site
		.then(function (response) {
				if(response.data){
					$scope.mailConfig = response.data;
					$scope.mailConfig.isNew = false;			//so we know if it is a new record or not.
				}
				else{
					$scope.mailConfig = {isNew = true};
				}
			},
			function (response) {
				messages.error(response.data);
			}
		);
		
	$scope.saveEmailConfig = function(toSave){
		if(toSave.isNew === false){
			$http({method: 'POST', url: '/api/site/' + $stateParams.site + '/data/private%20mail', data: toSave})      //get the list of groups that can view
				.then(function (response) {
						toSave.needsSave = false;
						toSave.isNew = false;
					},
					function (response) {
						messages.error(response.data);
					}
				);
		}
		else {
			$http({method: 'PUT', url: '/api/site/' + $stateParams.site + '/data/private%20mail', data: toSave})      //get the list of groups that can view
				.then(function (response) {
						toSave.needsSave = false;
					},
					function (response) {
						messages.error(response.data);
					}
				);
		}
	}

}]);
