/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict';


angular.module("deebobo").controller('userdetailsViewController',
    ['$scope', 'messages','toolbar', 'UserService'
    function ($scope, messages, toolbar, UserService) {

        toolbar.title = "user details";
        toolbar.buttons = [];

        $scope.user = angular.copy(UserService.user);			//we make a local copy, so that unsaved changes aren't reflected
		$scope.detailsNeedsSave = false;
		
		$scope.userPwd = {};
		$scope.pwdNeedsSave = false;

		//change the pwd for the user.
		function changePwd(user){
			UserService.update(user);
		}
        
		function updateDetails(user){
			UserService.update(user);
		}

    }]);


