/**
 * Created by Deebobo.dev on 27/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict';


angular.module('common.services', []);
angular.module('deebobo.controllers', ['common.directives']);
angular.module('common.directives', ['common.services']);

var deebobo = angular.module('deebobo', ['ui.router', 'ngMaterial', 'ui.bootstrap','ui.grid']);  //, 'ui-grid-move-columns', 'ui.grid.resizeColumns'

deebobo.config(['$stateProvider', '$locationProvider', '$controllerProvider', '$provide', '$compileProvider', '$filterProvider', '$urlRouterProvider',
    function ($stateProvider, $locationProvider, $controllerProvider, $provide, $compileProvider, $filterProvider, $urlRouterProvider) {
        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode(true);                  //don't use the # in the path

        $urlRouterProvider.rule(function($injector, $location) {

            var path = $location.path();
            var hasTrailingSlash = path[path.length-1] === '/';

            if(hasTrailingSlash) {

                //if last charcter is a slash, return the same url without the slash
                var newPath = path.substr(0, path.length - 1);
                return newPath;
            }

        });


        //abstract state for all site related urls. This is abstract to have a default root state, a non-abstract
        //version of the root state redirects to the default page...
        $stateProvider.state('site', {
            abstract: true,
            resolve: {                                   //need to load
                siteDetails: ['siteService', '$stateParams',
                    function (siteService, $stateParams) {
                        var res = siteService.get($stateParams);
                        return res;
                    }]
            },
            url: '/{site}',
            // Note: abstract still needs a ui-view for its children to populate.
            // You can simply add it inline here.
            template: '<ui-view flex layout="row"/>',
            access: {restricted: true}
        });


        //default page for the root url. Still abstract so that the default view can be loaded.
        $stateProvider.state('site.homepage', {
            abstract: true,
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
            url: '',
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
            access: {restricted: true}
        });

        $stateProvider.state('site.homepage.defaultview', {
            resolve: {                                   //need to load
                viewData: ['viewService', '$stateParams', 'siteDetails',
                    function (viewService, $stateParams, siteDetails) {
                        return viewService.get($stateParams.site, siteDetails.defaultView);
                    }]
            },
            url: '',
            views:{
                content:{
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

        //important: must be after site.homepage.defaultview, otherwise we can't go to root (site.homepage.defaultview picks up empty sitename)
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

        $stateProvider.state('sitelogin', {
            url: '/{site}/login',
            templateUrl: 'partials/site_login.html',
            controller: 'loginController',
            access: {restricted: false}
        });

        $stateProvider.state('siteregister', {
            url: '/{site}/register',
            templateUrl: 'partials/site_register.html',
            controller: 'registerController',
            access: {restricted: false}
        });

        $stateProvider.state('sitePwdReset', {
            url: '/{site}/resetpwd/{token}',
            templateUrl: 'partials/change_pwd.html',
            controller: 'resetPwdController',
            access: {restricted: false}
        });


        $stateProvider.state('site.page.general', {
            url: '/administration/general',
            views:{
                content: {
                    controller: 'adminGeneralController',
                    templateUrl: 'partials/admin_gen.html',
                }
            },
            access: {restricted: true}
        });

        $stateProvider.state('site.page.connections', {
            url: '/administration/connections',
            views:{
                content: {
                    controller: 'adminConnectionsController',
                    templateUrl: 'partials/admin_connections.html',
                }
            },
            access: {restricted: true}
        });


        $stateProvider.state('site.page.email', {
            url: '/administration/email',
            views:{
                content:{
                    controller: 'AdminEmailController',
                    templateUrl: 'partials/admin_email.html',
                }
            },
            access: {restricted: true}
        });

        $stateProvider.state('site.page.authorization', {
            url: '/administration/authorization',
            views:{
                content:{
                    controller: 'AdminAuthorizationController',
                    templateUrl: 'partials/admin_authorization.html'
                }
            },
            access: {restricted: true}
        });

        $stateProvider.state('site.page.plugins', {
            url: '/administration/plugins',
            views:{
                content:{
                    controller: 'AdminPluginsController',
                    templateUrl: 'partials/admin_plugins.html'
                }
            },
            access: {restricted: true}
        });

        $stateProvider.state('site.page.functions', {
            url: '/administration/function',
            views:{
                content:{
                    controller: 'adminFunctionsController',
                    templateUrl: 'partials/admin_functions.html'
                }
            },
            access: {restricted: true}
        });


        //another abstract state so that the default view can be loaded when going to a page only.
        $stateProvider.state('site.page', {
            abstract: true,
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
        });


        $stateProvider.state('site.page.defaultview', {
            resolve: {                                   //need to load
                viewData: ['viewService', '$stateParams', 'siteDetails',
                    function (viewService, $stateParams, siteDetails) {
                        return viewService.get($stateParams.site, siteDetails.defaultView);
                    }]
            },
            url: '',
            views:{
                content:{
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


        $stateProvider.state('site.page.view', {
            resolve: {                                   //need to load
                viewData: ['viewService', '$stateParams',
                    function (viewService, $stateParams) {
                        return viewService.get($stateParams.site, $stateParams.view);
                    }]
            },
            url: '/{view}',
            views:{
                content:{
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
				    $rootScope.addError({message:exception.message, cause: cause});
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

deebobo.run(function ($rootScope, $location, $state, AuthService, $mdToast) {
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
            $rootScope.addError(error);
        });

    $rootScope.addError = function(message){
        console.log(message);
        $mdToast.show($mdToast.simple()
		  .textContent(message)
		  .action('ok')
		  .highlightAction(true)
		  .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
		    .position('top right')
            //.hideDelay(5000)
         );


            /*.then(function(response) {
		  if ( response == 'ok' ) {
			//alert('You clicked the \'UNDO\' action.');
		  }
		});*/
		
    }
});
