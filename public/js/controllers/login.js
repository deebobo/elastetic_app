deebobo.controller('loginController', ['$scope', '$location', '$stateParams', 'AuthService', '$http', '$mdDialog',
  function ($scope, $location, $stateParams,  AuthService, $http, $mdDialog) {

	//helper function to show errors
	function showError(msg){
		$scope.error = true;
		$scope.errorMessage = msg;
		$scope.disabled = false;
	}
  
  
	$http({method: 'GET',  url: '/api/site'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
		.then(function (response){
			  $scope.sites = response.data
		}
		).catch(function onError(response){
			showError(response.data.message);
		}
	);
	  
    $scope.login = function () {
	  
	  if(!$scope.loginForm.selectedSite){						//check if all values are supplied, possibly some can be retrieved from the path.
		if(!$stateParams.site){
			showError("No site selected");
			return;												//get out of hte function, don't try to log in.
		}
		else
			$scope.loginForm.selectedSite = $stateParams.site;
	  }
	  
	  // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      let site = $scope.loginForm.selectedSite;
      AuthService.login(site, $scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
            $location.path('/' + site);
            $scope.disabled = false;
            //$scope.loginForm = {};
        })
        // handle error
        .catch(function (err) {
			showError(err);
        });

    };

	
	$scope.resetPwd = function(){
		
		if(!$scope.loginForm.selectedSite){						//check if all values are supplied, possibly some can be retrieved from the path.
		if(!$stateParams.site){
			showError("No site selected");
			return;												//get out of hte function, don't try to log in.
		}
		else
			$scope.loginForm.selectedSite = $stateParams.site;
		}
	  
		// initial values
		$scope.error = false;
		$scope.disabled = true;
		
		$http.post('/api/site/' + $scope.loginForm.selectedSite + '/resetpwd', {name: email})     // send a post request to the server
			.then(function (data) {                                      // handle success
				if(data && data.status == 200){
					$mdDialog.show(
                        $mdDialog.alert()
                            .parent(angular.element(document.querySelector('#popupContainer')))
                            .clickOutsideToClose(true)
                            .title('Password reset')
                            .textContent('Your password has been reset. You should receive an email with a new activation link shortly. Please follow the instructions found in the email.')
                            .ariaLabel('password reset')
                            .ok('ok')
                            .targetEvent(ev)
                    );
				} else {
					showError(data.data);
				}
			},function (data) {                                                // handle error
					showError(data.data);
				}
			);
	}
}]);

deebobo.controller('logoutController',
  ['$scope', '$location',
  function ($scope, $location) {

    $scope.logout = function () {

      // call logout from service
      AuthService.logout()
        .then(function () {
          $location.path('/login');
        });

    };

}]);