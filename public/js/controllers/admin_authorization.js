/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict'

deebobo.controller('AdminAuthorizationController',
    ['$scope', '$http', 'messages', '$mdDialog', '$stateParams',
        function ($scope, $http, messages, $mdDialog, $stateParams) {

			//scope vars
            //--------------------------------------------------------------------------------------

            $scope.groups = [];
			$scope.users = [];
			$scope.usersSelected = true;				//for the ui: this is the first tab that is selected.

		
            //get data from site for scope
			//--------------------------------------------------------------------------------------
            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/user'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
					$scope.users.push.apply($scope.users, response.data);
                },
                function (response) {
                    messages.error(response.data);
                }
            );
			
			$http({method: 'GET', url: '/api/site/' + $stateParams.site + '/group'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
					$scope.groups.push.apply($scope.groups, response.data);
                },
                function (response) {
                    messages.error(response.data);
                }
            );
			
			//html callbacks.
			//--------------------------------------------------------------------------------------
			
			$scope.resetPwd = function(user, ev){
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
			
			$scope.addUser = function(ev){
				var confirm = $mdDialog.prompt()
				  .title('Add new user')
				  .textContent('What is the email address of the user that you want to invite?')
				  .placeholder('email')
				  .ariaLabel('email')
				  .initialValue('')
				  .targetEvent(ev)
				  .ok('ok')
				  .cancel('cancel');
				
				$mdDialog.show(confirm).then(function(result) {
					var newUser = {email: result};
					$http({method: 'POST', url: '/api/site/' + $stateParams.site + '/user/invite', data: newUser} )      //get the list of groups that can view
					.then(function (response) {
							$scope.users.push(newUser);
						},
						function (response) {
							messages.error(response.data);
						}
					);
				}, function() {
					//user cancedeld, don't do anything.
				});
			}
			
			$scope.saveUser = function(user){
				$http({method: 'PUT', url: '/api/site/' + $stateParams.site + '/user/' + user._id, data: user})      //get the list of groups that can view
                        .then(function (response) {
                                user.needsSave = false;
                            },
                            function (response) {
                                messages.error(response.data);
                            }
                        );
			}
			
			$scope.addGroup = function(ev){
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
					var newGroup = {name: result};
					$http({method: 'POST', url: '/api/site/' + $stateParams.site + '/group', data: newGroup})      //get the list of groups that can view
					.then(function (response) {
							$scope.groups.push(response.data);
						},
						function (response) {
							messages.error(response.data);
						}
					);
				}, function() {
					//user canceled, don't do anything.
				});
			}
			
			$scope.deleteUser = function(user){
                var confirm = $mdDialog.confirm()
                    .title('Delete user')
                    .textContent('Are you certain you want to delete user: ' + user.name)
                    .ariaLabel('no')
                    .targetEvent(ev)
                    .ok('yes')
                    .cancel('no');

                $mdDialog.show(confirm).then(function() {
                    $http({method: 'DELETE', url: '/api/site/' + $stateParams.site + '/user/' + user._id})      //get the list of groups that can view
                        .then(function (response) {
                                $scope.users.splice($scope.users.indexOf(user), 1);
                            },
                            function (response) {
                                messages.error(response.data);
                            }
                        );
                }, function() {
                    //user canceled
                });

			};
			
			$scope.deleteGroup = function(group){
				$http({method: 'DELETE', url: '/api/site/' + $stateParams.site + '/group/' + group.name})      //get the list of groups that can view
				.then(function (response) {
						$scope.groups.splice($scope.groups.indexOf(user), 1);
					},
					function (response) {
						messages.error(response.data);
					}
				);
			}
			
			/** called when a group is added to a user
			*/
			$scope.groupAddedTo = function(user, chip){
				$http({method: 'POST', url: '/api/site/' + $stateParams.site + '/user/' + user._id + '/group/' + chip._id})      //get the list of groups that can view
				.then(function (response) {
						user.groups.push(chip);
					},
					function (response) {
						messages.error(response.data);
					}
				);
			}
			
			/** called when a group is added to a user
			*/
			$scope.groupRemovedFrom = function(user, chip){
				$http({method: 'DELETE', url: '/api/site/' + $stateParams.site + '/user/' + user._id + '/group/' + chip._id})      //get the list of groups that can view
				.then(function (response) {
					},
					function (response) {
						messages.error(response.data);
					}
				);
			}
			
			$scope.saveGroup = function(group){
				$http({method: 'PUT', url: '/api/site/' + $stateParams.site + '/group/' + group.name, data: group})      //get the list of groups that can view
                        .then(function (response) {
                                group.needsSave = false;
                            },
                            function (response) {
                                messages.error(response.data);
                            }
                        );
			}

			$scope.checkGroupChip = function(user, chip){
			    if(chip){
			        if(typeof chip === "object")
			            return chip;
			        var found = $scope.groups.find((item) =>{return item.name == chip} );
			        if(found)
			            return found;
                }
                return null;
            }
        }
    ]
);