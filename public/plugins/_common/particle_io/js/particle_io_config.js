/**
 * Created by Deebobo.dev on 1/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

angular.module("deebobo").controller('extAdminConnectionsController',
    ['$scope', '$controller', 'messages',
    function($scope, $controller, messages) {
    angular.extend(this, $controller('adminConnectionsController', {$scope: $scope}));


    var currentPluginPath = function () {

        var currentScript = document.currentScript.src;
        var currentScriptChunks = currentScript.split( '/' );
        var currentScriptFile = currentScriptChunks[ currentScriptChunks.length - 2 ];

        return currentScript.replace( currentScriptFile, '' );
    };

    $scope.get_particle_io_access_token = function(connection){

        $mdDialog.show({
            controller: DialogController,
            templateUrl: currentPluginPath() + '/partials/particle_io_login.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: false // Only for -xs, -sm breakpoints.
        })
            .then(function(answer) {
                var particle = new Particle();

                particle.login({username: answer.usename, password: answer.pwd}).then(
                    function(data) {
                        connection.content.token = data.body.access_token;
                    },
                    function (err) {
                        messages.error('Could not log in: ' + err);
                    }
                );
            }, function() {

            });
    };

    function DialogController($scope, $mdDialog) {

        $scope.result = {username: "", pwd: ""};

        $scope.hide = function() {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

}]);
