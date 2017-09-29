/**
 * Created by elastetic.dev on 5/06/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict';


angular.module("elastetic").controller('userDetailsViewController',
    ['$scope', 'messages','toolbar', 'UserService',
    function ($scope, messages, toolbar, UserService) {

        toolbar.title = "user details";
        toolbar.buttons = [];

        $scope.user = angular.copy(UserService.user);			//we make a local copy, so that unsaved changes aren't reflected
		$scope.detailsNeedsSave = false;
		
		$scope.userPwd = {};
		$scope.pwdNeedsSave = false;

		//change the pwd for the user.
		function changePwd(user){
			UserService.update(user, function()
			{
				$scope.pwdNeedsSave = false;
			});
		}
        
		$scope.updateDetails = function (user){
			UserService.update(user, function()
			{
				$scope.detailsNeedsSave = false;
			});
		}

    }]);


