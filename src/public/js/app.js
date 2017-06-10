/**
 * Created by Deebobo.dev on 27/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict';


angular.module('common.services', []);
angular.module('deebobo.controllers', ['common.directives']);
angular.module('common.directives', ['common.services']);

var deebobo = angular.module('deebobo', ['ui.router', 'ngMaterial', 'ui.bootstrap']);  //'ngMdIcons',


deebobo.config(['$stateProvider', '$locationProvider',
    function ($stateProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode(true);                  //don't use the # in the path
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'partials/home.html',
            access: {restricted: false}
        });
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'loginController',
            access: {restricted: false}
        });
        $stateProvider.state('register', {
            url: '/register',
            templateUrl: 'partials/register.html',
            controller: 'registerController',
            access: {restricted: false}
        });
        $stateProvider.state('create', {
            url: '/create',
            templateUrl: 'partials/new_site_register.html',
            controller: 'sitesController',
            access: {restricted: false}
        });
        $stateProvider.state('site', {
            resolve: {                                   //need to load
                siteDetails: ['siteService', '$stateParams',
                    function (siteService, $stateParams) {
                        return siteService.get($stateParams);
                    }],
                homepage: ['pageService', 'siteDetails',
                    function (pageService, siteDetails) {
                        return pageService.get(siteDetails._id, siteDetails.homepage);
                    }]
            },
            url: '/{site}',
            templateUrl: function ($stateParams) {
                return homepage.partial; // 'partials/site_home.html';
            },
            controllerProvider: function ($stateParams, $scope) {
                return $scope.homepage.controller;
            },
            access: {restricted: true}
        });
        $stateProvider.state('site.register', {
            url: '/register',
            templateUrl: 'partials/site_register.html',
            controller: 'siteRegisterController',
            access: {restricted: false}
        });
        $stateProvider.state('site.login', {
            url: '/login',
            templateUrl: 'partials/site_login.html',
            controller: 'siteLoginController',
            access: {restricted: false}
        });


        $stateProvider.state('site.page', {
            resolve: {                                   //need to load
                page: ['pageService',
                    function (pageService) {
                        return pageService.get($stateParams.page);
                    }]
            },
            url: '/{page}',
            templateUrl: function ($stateParams) {
                return page.partial; // 'partials/site_home.html';
            },
            controllerProvider: function ($stateParams) {
                return page.controller;
            },
            access: {restricted: false}
        });

        $stateProvider.state('site.page.view', {
            url: '/{view}',
            templateUrl: 'partials/view.html',
            controller: 'ViewController',
            access: {restricted: false}
        });

        $stateProvider.state('logout', {
            url: '/logout',
            controller: 'logoutController',
            access: {restricted: true}
        });
        $stateProvider.state('otherwise', {
            url: "*path",
            templateUrl: 'partials/error-not-found.html'
        });
    }]);

deebobo.run(function ($rootScope, $location, $state, AuthService) {
    $rootScope.$on('$stateChangeStart',
        function (event, next, current) {
            if ((!next.access || next.access.restricted) && !AuthService.isLoggedIn()) {
                $location.path('/login');
                $state.reload();
            }
        });
});

deebobo.run(function ($rootScope) {
    $rootScope.$on("$stateChangeError", console.log.bind(console));
});
