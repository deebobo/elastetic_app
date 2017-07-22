/**
 * Created by Deebobo.dev on 1/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */


angular.module("deebobo").controller('extAdminConnectionsController',
    ['$scope', '$controller', 'messages', '$mdDialog',
    function($scope, $controller, messages, $mdDialog) {
    //angular.extend(this, $controller('adminConnectionsController', {$scope: $scope})); -> no longer needed, configs are now rapped inside pluginConfigurator directive.

    var _currentPluginPath = null;

    var currentPluginPath = function () {

        if(!_currentPluginPath){
            var scripts = document.getElementsByTagName("script");
            var scriptSrc = null;
            for(i = 0; i < scripts.length; i++){
                if(scripts[i].src.endsWith("/particle_io_config.js")){
                    scriptSrc =  scripts[i].src;
                    break;
                }
            }
            if(scriptSrc) {
                var currentScriptChunks = scriptSrc.split('/');
                currentScriptChunks.splice(currentScriptChunks.length - 2, 2);
                _currentPluginPath = currentScriptChunks.join('/');
            }
        }
        return _currentPluginPath;
    };

    $scope.get_particle_io_access_token = function(connection, ev){
        var parent = angular.element(document.body);
        $mdDialog.show({
            controller: DialogController,
            templateUrl: currentPluginPath() + '/partials/particle_io_login.html',
            parent: parent,
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: false // Only for -xs, -sm breakpoints.
        })
            .then(function(answer) {
                var particle = new Particle();

                particle.login({username: answer.username, password: answer.pwd}).then(
                    function(data) {
                        if(connection.content)                                      //could be that there was no value set yet, in which case this is empty.
                            connection.content.token = data.body.access_token;
                        else
                            connection.content = {token: data.body.access_token};
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
