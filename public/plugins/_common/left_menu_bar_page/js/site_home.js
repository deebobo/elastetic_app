/**
 * Created by elastetic.dev on 5/06/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */



angular.module("elastetic").controller('siteHomeController', ['$scope', '$location', 'menu', '$stateParams', '$state', '$mdSidenav', 'siteDetails', 'page', 'toolbar', 'AuthService',
    function ($scope, $location, menu, $stateParams, $state,  $mdSidenav, siteDetails, page, toolbar, AuthService) {


        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };

        $scope.toolbarBtnClicked = function(btn, ev){
            if(btn)
                btn.click(ev);
        };


        function isOpen(section) {
            return menu.isSectionSelected(section);
        }

        function toggleOpen(section) {
            menu.toggleSelectSection(section);
        }


        function toggleSidenav(navid){
            $mdSidenav(navid).toggle();
        }

        $scope.logout = function(){
			AuthService.logout();
			$location.path('/login');		//go to the login page
		}
		
		$scope.showUserDetails = function(){
			menu.select({type: "link", view: "user details"});
		};

        //functions for menu-link and menu-toggle
        $scope.isOpen = isOpen;
        $scope.toggleOpen = toggleOpen;
        $scope.toggleSidenav = toggleSidenav;
        $scope.autoFocusContent = false;
        $scope.menu = menu;

        //$scope.sitename = $stateParams.site;
        $scope.site = siteDetails;
        $scope.toolbar = toolbar;

        //when the state has changed, make certain that the menu closes again.
        menu.onselect = function(){$mdSidenav('left').close();};

        menu.sections = page.data.menu;

        $scope.openUserMenu = function($mdMenu, ev) {
            $mdMenu.open(ev);
        };

    }]);

//console.log("working");
