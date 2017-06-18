/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

deebobo.controller('AdminAuthorizationController',
    ['$scope', '$mdDialog',
        function ($scope, $mdDialog) {

            //get data from site for scope
			//--------------------------------------------------------------------------------------
            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/user'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
                    $scope.users = response.data;
                },
                function (response) {
                    messages.error(response.data);
                }
            );
			
			$http({method: 'GET', url: '/api/site/' + $stateParams.site + '/group'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
                    $scope.groups = response.data;
                },
                function (response) {
                    messages.error(response.data);
                }
            );
			
			//html callbacks.
			//--------------------------------------------------------------------------------------
			
			$scope.resetPwd = function(user){
				var confirm = $mdDialog.confirm()
					  .title('Reset password')
					  .textContent('Are you certain you want to reset the password for ' + user.name)
					  .ariaLabel('no')
					  .targetEvent(ev)
					  .ok('yes')
					  .cancel('no');

				$mdDialog.show(confirm).then(function() {
					$http({method: 'POST', url: '/api/site/' + $stateParams.site + '/user/' + user._id +  '/resetpwd'})      //get the list of groups that can view
					.then(function (response) {
						},
						function (response) {
							messages.error(response.data);
						}
					);
				}, function() {
				  //user canceled
				});
			}
			
			$scope.addUser = function(){
				var confirm = $mdDialog.prompt()
				  .title('Add new user')
				  .textContent('What is the email address of the user that you want to invite?')
				  .placeholder('name')
				  .ariaLabel('name')
				  .initialValue('')
				  .targetEvent(ev)
				  .ok('ok')
				  .cancel('cancel');

				$mdDialog.show(confirm).then(function(result) {
					$http({method: 'POST', url: '/api/site/' + $stateParams.site + '/user/invite'}, {email: result} )      //get the list of groups that can view
					.then(function (response) {
						},
						function (response) {
							messages.error(response.data);
						}
					);
				}, function() {
					messages.error(response.data);
				});
			}
			
			$scope.addGroup = function(){
				var confirm = $mdDialog.prompt()
				  .title('Add new group')
				  .textContent('What is the name of the group?')
				  .placeholder('name')
				  .ariaLabel('name')
				  .initialValue('')
				  .targetEvent(ev)
				  .ok('ok')
				  .cancel('cancel');

				$mdDialog.show(confirm).then(function(result) {
					$http({method: 'POST', url: '/api/site/' + $stateParams.site + '/group/' + result})      //get the list of groups that can view
					.then(function (response) {
						},
						function (response) {
							messages.error(response.data);
						}
					);
				}, function() {
					messages.error(response.data);
				});
			}
			
			$scope.deleteUser = function(user){
				$http({method: 'DELETE', url: '/api/site/' + $stateParams.site + '/user/' + user._id})      //get the list of groups that can view
				.then(function (response) {
					},
					function (response) {
						messages.error(response.data);
					}
				);
			}
			
			$scope.deleteGroup = function(group){
				$http({method: 'DELETE', url: '/api/site/' + $stateParams.site + '/group/' + group.name})      //get the list of groups that can view
				.then(function (response) {
					},
					function (response) {
						messages.error(response.data);
					}
				);
			}
			
			/** called when a group is added to a user
			*/
			$scope.groupAddedTo = function(user, chip){
				$http({method: 'POST', url: '/api/site/' + $stateParams.site + '/user/' + user._id + '/group/' + chip.name})      //get the list of groups that can view
				.then(function (response) {
					},
					function (response) {
						messages.error(response.data);
					}
				);
			}
			
			/** called when a group is added to a user
			*/
			$scope.groupRemovedFrom = function(user, chip){
				$http({method: 'DELETE', url: '/api/site/' + $stateParams.site + '/user/' + user._id + '/group/' + chip.name})      //get the list of groups that can view
				.then(function (response) {
					},
					function (response) {
						messages.error(response.data);
					}
				);
			}
        }
    ]
);