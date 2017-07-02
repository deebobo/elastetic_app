/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */



angular.module("deebobo").controller('particlIODevicesViewController', ['$scope', 'messages',
    function ($scope, messages) {
        var particle = new Particle();

        $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/connection?' + $scope.viewData.plugin._id})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
                    particle.listDevices({ auth: response.content.token }).then(
                        function(devices){
                            $scope.devices = devices;
                        },
                        function(err){
                            messages.error(err);
                        }
                    );
                },
                function (response) {
                    messages.error(response.data);
                }
            );

    }]);

//console.log("working");

