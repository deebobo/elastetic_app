/**
 * Created by Deebobo.dev on 1/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */


angular.module("deebobo").controller('extAdminFunctionsController',
    ['$scope', '$controller', 'messages', '$mdDialog', '$http', '$stateParams',
        function($scope, $controller, messages, $mdDialog, $http, $stateParams) {
            //angular.extend(this, $controller('adminFunctionsController', {$scope: $scope}));

            $scope.connections = [];

            //get data from site for scope
            //--------------------------------------------------------------------------------------
            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/connection'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
                .then(function (response) {
                        $scope.connections.push.apply($scope.connections, response.data);
                    },
                    function (response) {
                        messages.error(response.data);
                    }
                );

            /*if($scope.value.data && $scope.value.data.token){                    //if there is a token id, get the actual token value.
                $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/token/' + $scope.value.data.token})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
                    .then(function (response) {
                            $scope.token = response.data.token;
                        },
                        function (response) {
                            messages.error(response.data);
                        }
                    );
            }*/

        }]);
