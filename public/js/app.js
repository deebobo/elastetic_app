/**
 * Created by Deebobo.dev on 27/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict';


angular.module('common.services', []);
angular.module('deebobo.controllers', ['common.directives']);
angular.module('common.directives', ['common.services']);

var deebobo = angular.module('deebobo', ['ui.router', 'ngMaterial', 'ui.bootstrap']);  //,'ui.grid', 'ui.grid.resizeColumns', 'ui-grid-move-columns'

deebobo.config(['$stateProvider', '$locationProvider', '$controllerProvider', '$provide', '$compileProvider', '$filterProvider',
    function ($stateProvider, $locationProvider, $controllerProvider, $provide, $compileProvider, $filterProvider) {
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
                        var res = siteService.get($stateParams);
                        return res;
                    }],
                page: ['pageService', 'siteDetails', "menu",
                    function (pageService, siteDetails, menu) {
                        var temp = pageService.get(siteDetails._id, siteDetails.homepage);
                        menu.homepage = siteDetails.homepage;                       //let the menu know the name of the homepage, so it can use this while changing states (go to different webpage), so it can use the homepage name if no other page is currently loaded.
                        return temp;
                    }]
            },
            url: '/{site}',
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
            //templateUrl: "plugins/_common/left_menu_bar_page/partials/site_home.html",
            //Controller: "siteHomeController",
            //templateUrl: 'partials/login.html',
            //controller: 'siteHomeController',
            access: {restricted: true}
        });
        $stateProvider.state('site.register', {
            url: '/register',
            templateUrl: 'partials/site_register.html',
            controller: 'registerController',
            access: {restricted: false}
        });

        $stateProvider.state('site.login', {
            url: '/login',
            templateUrl: 'partials/site_login.html',
            controller: 'loginController',
            access: {restricted: false}
        });

        $stateProvider.state('site.general', {
            url: '/administration/general',
            views:{
                content: {
                    controller: 'adminGeneralController',
                    templateUrl: 'partials/admin_gen.html',
                }
            },
            access: {restricted: true}
        });

        $stateProvider.state('site.connections', {
            url: '/administration/connections',
            views:{
                content: {
                    controller: 'adminConnectionsController',
                    templateUrl: 'partials/admin_connections.html',
                }
            },
            access: {restricted: true}
        });


        $stateProvider.state('site.email', {
            url: '/administration/email',
            views:{
                content:{
                    controller: 'AdminEmailController',
                    templateUrl: 'partials/admin_email.html',
                }
            },
            access: {restricted: true}
        });

        $stateProvider.state('site.authorization', {
            url: '/administration/authorization',
            views:{
                content:{
                    controller: 'AdminAuthorizationController',
                    templateUrl: 'partials/admin_authorization.html'
                }
            },
            access: {restricted: true}
        });

        $stateProvider.state('site.plugins', {
            url: '/administration/plugins',
            views:{
                content:{
                    controller: 'AdminPluginsController',
                    templateUrl: 'partials/admin_plugins.html'
                }
            },
            access: {restricted: true}
        });

        $stateProvider.state('site.functions', {
            url: '/administration/function',
            views:{
                content:{
                    controller: 'adminFunctionsController',
                    templateUrl: 'partials/admin_functions.html'
                }
            },
            access: {restricted: true}
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
                pluginService.load(page.plugin.client)
                    .then(function(){ deferred.resolve(page.controller); });
                return deferred.promise;
            }],
            access: {restricted: false}
        }).state('site.view', {
            resolve: {                                   //need to load
                viewData: ['viewService', '$stateParams',
                    function (viewService, $stateParams) {
                        return viewService.get($stateParams.site, $stateParams.view);
                    }]
            },
            url: '/{page}/{view}',
            views:{
                content:{
                    //controller: 'adminGeneralController',
                    //templateUrl: 'partials/admin_gen.html',
                    templateProvider: ['viewData', '$q', '$http', function (viewData, $q, $http) {
                        var deferred = $q.defer();
                        $http.get("plugins/" + viewData.plugin.client.partials[viewData.partial]).then(function(data) {
                            deferred.resolve(data.data);
                        });
                        return deferred.promise;
                    }],
                    controllerProvider: ['viewData','$q', 'pluginService',  function (viewData, $q, pluginService) {
                        var deferred = $q.defer();
                        pluginService.load(viewData.plugin.client)
                            .then(function(){ deferred.resolve(viewData.controller); });
                        return deferred.promise;
                    }]
                }
            },
            access: {restricted: true}
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
		
		
		$provide.decorator("$exceptionHandler", function($delegate, $injector){				//error handling from rootscope, see: http://odetocode.com/blogs/scott/archive/2014/04/21/better-error-handling-in-angularjs.aspx
			return function(exception, cause){
				var $rootScope = $injector.get("$rootScope");
				if($rootScope && typeof $rootScope.addError === "function")
				    $rootScope.addError({message:"Exception", reason:exception});
				$delegate(exception, cause);
			};
    });

        deebobo.controller = $controllerProvider.register;   //needed to dynamically load items
        deebobo.directive = $compileProvider.directive;
        deebobo.filter = $filterProvider.register;
        deebobo.factory = $provide.factory;
        deebobo.service = $provide.service;


        deebobo.requires.push()

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
    $rootScope.$on('$stateChangeError',
        function(event, toState, toParams, fromState, fromParams, error){
        console.log(error);
        })

    $rootScope.addError = function(message){
        //todo: add error message to list
        console.log("todo: add error message to list");
    }
});

deebobo.run(function ($rootScope) {
    $rootScope.$on("$stateChangeError", console.log.bind(console));
});
