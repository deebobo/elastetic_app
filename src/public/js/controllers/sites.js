/**
 * Created by Deebobo.dev on 3/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

deebobo.controller('sitesController', ['$scope', '$location', 'sitesService', '$http',
    function ($scope, $location, sitesService, $http) {

        $http({method: 'GET', url: '/api/sites'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
                    $scope.sites = response.data
                },
                function (response) {
                    $scope.error = true;
                    $scope.errorMessage = response.data;
                }
                );

        $scope.createsite = function () {
            // initial values
            $scope.error = false;
            $scope.disabled = true;

            // call login from service
            sitesService.create($scope.createForm.sitename, $scope.createForm.username, $scope.createForm.email, $scope.createForm.password)
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