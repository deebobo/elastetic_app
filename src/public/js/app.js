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


deebobo.config(['$stateProvider', '$locationProvider', '$controllerProvider',
    function ($stateProvider, $locationProvider, $controllerProvider) {
        deebobo.controller = $controllerProvider.register;
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
                        var temp = pageService.get(siteDetails._id, siteDetails.homepage);
                        return temp;
                    }]
            },
            url: '/{site}',/*
            templateProvider: ['homepage', '$q', '$http', function (homepage, $q, $http) {
                var deferred = $q.defer();
                $http.get("plugins/" + homepage.plugin.client.partials[homepage.partial]).then(function(data) {
                    deferred.resolve(data.data);
                });
                return deferred.promise;
            }],



            controllerProvider: ['homepage','$q', 'pluginService',  function (homepage, $q, pluginService) {
                var deferred = $q.defer();
                pluginService.loadSingle(homepage.plugin.client.scripts[0])
                   .then(function(){ deferred.resolve(homepage.controller); });
                return deferred.promise;
            }],*/
            templateUrl: "plugins/_common/left_menu_bar_page/partials/site_home.html",
            Controller: "siteHomeController",
            //templateUrl: 'partials/login.html',
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
                page: ['pageService', '$stateParams',
                    function (pageService, $stateParams) {
                        return pageService.get($stateParams.site, $stateParams.page);
                    }]
            },
            url: '/{page}',
            templateProvider: ['page', '$q', '$http', function (page, $q, $http) {
                var deferred = $q.defer();
                $http.get("plugins/" + page.plugin.client.partials[page.partial]).then(function(data) {
                    deferred.resolve(data.data);
                });
                return deferred.promise;
            }],
            controllerProvider: ['page','$q', 'pluginService',  function (page, $q, pluginService) {
                var deferred = $q.defer();
                pluginService.loadSingle(page.plugin.client.scripts[0])
                    .then(function(){ deferred.resolve(page.controller); });
                return deferred.promise;
            }],
            access: {restricted: false}
        });

        $stateProvider.state('site.page.view', {
            resolve: {                                   //need to load
                view: ['viewService', '$stateParams',
                    function (viewService, $stateParams) {
                        return viewService.get($stateParams.site, $stateParams.view);
                    }]
            },
            url: '/{view}',
            templateProvider: ['view', '$q', '$http', function (view, $q, $http) {
                var deferred = $q.defer();
                $http.get("plugins/" + view.client.partial).then(function(data) {
                    deferred.resolve(data.data);
                });
                return deferred.promise;
            }],
            controllerProvider: ['view','$q', 'pluginService',  function (view, $q, pluginService) {
                var deferred = $q.defer();
                pluginService.loadSingle(view.plugin.client.scripts[0])
                    .then(function(){ deferred.resolve(view.controller); });
                return deferred.promise;
            }],
            access: {restricted: false}
        });

        $stateProvider.state('logout', {
            url: '/logout',
            controller: 'logoutController',
            access: {restricted: true}
        });

        $stateProvider.state('administration', {
            url: '/administration',
            redirectTo: 'administration.general',
            access: {restricted: true}
        });

        $stateProvider.state('administration.general', {
            url: '/general',
            controller: 'adminGeneralController',
            templateUrl: 'partials/adminGen.html',
            access: {restricted: true}
        });

        $stateProvider.state('administration.email', {
            url: '/email',
            controller: 'AdminEmailController',
            templateUrl: 'partials/adminEmail.html',
            access: {restricted: true}
        });

        $stateProvider.state('administration.authorization', {
            url: '/authorization',
            controller: 'AdminAuthorizationController',
            templateUrl: 'partials/adminAuthorization.html',
            access: {restricted: true}
        });

        $stateProvider.state('administration.plugins', {
            url: '/plugins',
            controller: 'AdminPluginsController',
            templateUrl: 'partials/adminPlugins.html',
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
            if(next.redirectoTo){
                event.preventDefault();
                $state.go(next.redirectTo, current, {location: 'replace'})
            }
        });
});

deebobo.run(function ($rootScope) {
    $rootScope.$on("$stateChangeError", console.log.bind(console));
});
