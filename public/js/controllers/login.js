deebobo.controller('loginController', ['$scope', '$location', '$stateParams', 'AuthService', '$http',
  function ($scope, $location, $stateParams,  AuthService, $http) {

	$http({method: 'GET',  url: '/api/site'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
		.then(function (response){
			  $scope.sites = response.data
		}
		).catch(function onError(response){
			$scope.error = true;
			$scope.errorMessage = response.data.message;
		}
	);
  
    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;
	  
	  if(!$scope.loginForm.selectedSite){						//check if all values are supplied, possibly some can be retrieved from the path.
		if(!$stateParams.site){
			$scope.error = true;
			$scope.errorMessage = "No site selected";
			return;												//get out of hte function, don't try to log in.
		}
		else
			$scope.loginForm.selectedSite = $stateParams.site;
	  }

      // call login from service
      let site = $scope.loginForm.selectedSite;
      AuthService.login(site, $scope.loginForm.username, $scope.loginForm.password)
        // handle success
        .then(function () {
          $location.path('/' + site);
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function (err) {
          $scope.error = true;
          $scope.errorMessage = err;
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };

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