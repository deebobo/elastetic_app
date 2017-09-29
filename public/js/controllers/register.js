'use strict'
elastetic.controller('registerController', ['$scope', '$location', '$stateParams', 'AuthService', '$http', 'UserService',
    function ($scope, $location, $stateParams, AuthService, $http, UserService) {

        $http({method: 'GET', url: '/api/site'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
                    $scope.sites = response.data
                }
            ).catch(function onError(response) {
                $scope.error = true;
                $scope.errorMessage = response.data.message;
            }
        );

        $scope.register = function () {

            // initial values
            $scope.error = false;
            $scope.disabled = true;

            if (!$scope.registerForm.selectedSite) {						//check if all values are supplied, possibly some can be retrieved from the path.
                if (!$stateParams.site) {
                    $scope.error = true;
                    $scope.errorMessage = "No site selected";
                    return;												//get out of hte function, don't try to log in.
                }
                else {
                    $scope.registerForm.selectedSite = $stateParams.site;
                }
            }

            if($scope.registerForm.password != $scope.registerForm.password2){
                $scope.error = true;
                $scope.errorMessage = "passwords don't match";
                $scope.disabled = false;
                return;
            }

            // call login from service
            let site = $scope.registerForm.selectedSite;
            AuthService.register(site, $scope.registerForm.username, $scope.registerForm.email, $scope.registerForm.password)
            // handle success
                .then(function (data) {
                    UserService.user = data;
                    $location.path('/' + site);
                    $scope.disabled = false;
                    $scope.registerForm = {};
                },
                    function (err) {
                        $scope.error = true;
                        if(err){
                            if(err.hasOwnProperty('data'))
                                $scope.errorMessage = err.data;
                            else
                                $scope.errorMessage = err;
                        }else{
                            $scope.errorMessage = "unknown error";
                        }
                        $scope.disabled = false;
                        //$scope.registerForm = {};
                    });
        };

        $scope.createsite = function () {
            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call login from service
            AuthService.create($scope.createForm.sitename, $scope.createForm.username, $scope.createForm.email, $scope.createForm.password)
            // handle success
                .then(function () {
                    $location.path('/' + $scope.createForm.sitename);
                    $scope.disabled = false;
                    $scope.createForm = {};
                })
                // handle error
                .catch(function (err) {
                    $scope.error = true;
                    $scope.errorMessage = err;
                    $scope.disabled = false;
                    $scope.createForm = {};
                });
        };

    }]
);