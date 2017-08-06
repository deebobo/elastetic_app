/**
 * Created by Deebobo.dev on 15/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict'
deebobo.controller('resetPwdController',
    ['$scope', '$stateParams', '$location',
        function ($scope, $stateParams, $location) {


            //helper function to show errors
            function showError(msg){
                $scope.error = true;
                $scope.errorMessage = msg;
                $scope.disabled = false;
            }



            $scope.changePwd = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                if($scope.registerForm.password != $scope.registerForm.password2){
                    showError("passwords don't match");
                    return;
                }

                var data = {token: $stateParams.token,
                            pwd: $scope.password};

                $http({method: 'POST', url: '/api/site/' + $stateParams.site + '/changepwd', data: data})      //get the list of groups that can view
                    .then(function (response) {

                            var confirm = $mdDialog.confirm()
                                .title('Password changed')
                                .textContent('Your password has been succesfully changed. Please log in again with your new credentials.')
                                .ariaLabel('password changed')
                                .targetEvent(ev)
                                .ok('ok');

                            $mdDialog.show(confirm).then(function() {
                                $location.path('/login');
                            });


                        },
                        function (response) {
                            showError(response.data);
                        }
                    );

            };

        }]);