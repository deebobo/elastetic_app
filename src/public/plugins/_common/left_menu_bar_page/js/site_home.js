/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */



angular.module("deebobo").controller('siteHomeController', ['$scope', '$location', 'menu', '$stateParams', '$state', '$mdSidenav',
    function ($scope, $location, menu, $stateParams, $state,  $mdSidenav) {

        var aboutMeArr = ['Family', 'Location', 'Lifestyle'];
        var budgetArr = ['Housing', 'LivingExpenses', 'Healthcare', 'Travel'];
        var incomeArr = ['SocialSecurity', 'Savings', 'Pension', 'PartTimeJob'];
        var advancedArr = ['Assumptions', 'BudgetGraph', 'AccountBalanceGraph', 'IncomeBalanceGraph'];

        var page = {name: "home"};                                                          //the data for the page that is shown at the site home.

        $scope.status = {
            isFirstOpen: true,
            isFirstDisabled: false
        };


        function isOpen(section) {
            return menu.isSectionSelected(section);
        }

        function toggleOpen(section) {
            menu.toggleSelectSection(section);
        }

        function gotoPage(page){
            $state.go( $scope.sitename + '.' + page);
        }

        function gotoView(view){
            $state.go( $scope.sitename + '.' + page.name + '.' + view);
        }


        function toggleSidenav(navid){
            $mdSidenav(navid).toggle();
        }

        //functions for menu-link and menu-toggle
        $scope.isOpen = isOpen;
        $scope.toggleOpen = toggleOpen;
        $scope.gotoPage = gotoPage;
        $scope.gotoView = gotoView;
        $scope.toggleSidenav = toggleSidenav;
        $scope.autoFocusContent = false;
        $scope.menu = menu;

        $scope.sitename = $stateParams.site;

    }]);

console.log("working");
