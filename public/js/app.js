/**
 * Created by elastetic.dev on 27/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict';


angular.module('common.services', []);
angular.module('elastetic.controllers', ['common.directives']);
angular.module('common.directives', ['common.services']);

var elastetic = angular.module('elastetic', ['ui.router', 'ngMaterial',
                                         'ngSanitize',                  // required for ng-bindhtml
                                         'ui.bootstrap','ui.grid',
										 'ngResource'
										 ]);  //, 'ui-grid-move-columns', 'ui.grid.resizeColumns'

elastetic.config(['$stateProvider', '$locationProvider', '$controllerProvider', '$provide', '$compileProvider', '$filterProvider', '$urlRouterProvider', '$mdThemingProvider',
    function ($stateProvider, $locationProvider, $controllerProvider, $provide, $compileProvider, $filterProvider, $urlRouterProvider, $mdThemingProvider) {
        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode(true);                  //don't use the # in the path
        $mdThemingProvider.generateThemesOnDemand(true);
        $provide.value('themeProvider', $mdThemingProvider);


        //this is required to support client state urls that end with a dash.  if we dont' do this,
        //then url like /site/  will try to go to a /site/page where page is empty.
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
            //sets the theme colors
            controller: function(themeProvider, $mdTheming, siteDetails){
                if(!siteDetails.theme)
                    siteDetails.theme = {};
                if(!siteDetails.theme.primary)
                    siteDetails.theme.primary = "blue";
                themeProvider.theme('default').primaryPalette(siteDetails.theme.primary);
                if(!siteDetails.theme.accent)
                    siteDetails.theme.accent = "pink";
                themeProvider.theme('default').accentPalette(siteDetails.theme.accent);
                if(!siteDetails.theme.background)
                    siteDetails.theme.background = "grey";
                themeProvider.theme('default').backgroundPalette(siteDetails.theme.background);
                if(!siteDetails.theme.warn)
                    siteDetails.theme.warn = "deep-orange";
                themeProvider.theme('default').warnPalette(siteDetails.theme.warn);
                $mdTheming.generateTheme('default');                //reload the themes
            },
            restricted: true
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
            restricted: true
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
            restricted: true
        });

        //important: must be after site.homepage.defaultview, otherwise we can't go to root (site.homepage.defaultview picks up empty sitename)
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'partials/home.html',
            restricted: false
        });



        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'loginController',
            restricted: false
        });
        $stateProvider.state('register', {
            url: '/register',
            templateUrl: 'partials/register.html',
            controller: 'registerController',
            restricted: false
        });
        $stateProvider.state('create', {
            url: '/create',
            templateUrl: 'partials/new_site_register.html',
            controller: 'sitesController',
            restricted: false
        });

        $stateProvider.state('sitelogin', {
            url: '/{site}/login',
            templateUrl: 'partials/site_login.html',
            controller: 'loginController',
            restricted: false
        });

        $stateProvider.state('siteregister', {
            url: '/{site}/register',
            templateUrl: 'partials/site_register.html',
            controller: 'registerController',
            restricted: false
        });

        $stateProvider.state('sitePwdReset', {
            url: '/{site}/resetpwd/{token}',
            templateUrl: 'partials/change_pwd.html',
            controller: 'resetPwdController',
            restricted: false
        });


        $stateProvider.state('site.page.general', {
            url: '/administration/general',
            views:{
                content: {
                    controller: 'adminGeneralController',
                    templateUrl: 'partials/admin_gen.html',
                }
            },
            restricted: true
        });

        $stateProvider.state('site.page.connections', {
            url: '/administration/connections',
            views:{
                content: {
                    controller: 'adminConnectionsController',
                    templateUrl: 'partials/admin_connections.html',
                }
            },
            restricted: true
        });


        $stateProvider.state('site.page.email', {
            url: '/administration/email',
            views:{
                content:{
                    controller: 'AdminEmailController',
                    templateUrl: 'partials/admin_email.html',
                }
            },
            restricted: true
        });

        $stateProvider.state('site.page.authorization', {
            url: '/administration/authorization',
            views:{
                content:{
                    controller: 'AdminAuthorizationController',
                    templateUrl: 'partials/admin_authorization.html'
                }
            },
            restricted: true
        });

        $stateProvider.state('site.page.plugins', {
            url: '/administration/plugins',
            views:{
                content:{
                    controller: 'AdminPluginsController',
                    templateUrl: 'partials/admin_plugins.html'
                }
            },
            restricted: true
        });

        $stateProvider.state('site.page.functions', {
            url: '/administration/function',
            views:{
                content:{
                    controller: 'adminFunctionsController',
                    templateUrl: 'partials/admin_functions.html'
                }
            },
            restricted: true
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
            restricted: false
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
            restricted: true
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
            restricted: true
        });

        $stateProvider.state('site.page.view.details', {
            url: '/{details}',
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
            restricted: true
        });

        $stateProvider.state('site.page.view.connection_and_details', {     //state can be used for details of a view that are specific to a connection. connection = id .
            url: '/{connection}/{details}',
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
            restricted: true
        });

        $stateProvider.state('logout', {
            url: '/logout',
            controller: 'logoutController',
            restricted: true
        });

        $stateProvider.state('otherwise', {
            url: "*path",
            templateUrl: 'partials/error-not-found.html'
        });
		
		
		$provide.decorator("$exceptionHandler", function($delegate, $injector){				//error handling from rootscope, see: http://odetocode.com/blogs/scott/archive/2014/04/21/better-error-handling-in-angularjs.aspx
			return function(exception, cause){
				var $rootScope = $injector.get("$rootScope");
				if($rootScope && typeof $rootScope.addError === "function"){
				    if(typeof exception === "string")
                        $rootScope.addError(exception);
				    else
                        $rootScope.addError({message:exception.message, cause: cause});
                }
				$delegate(exception, cause);
			};
    });

        elastetic.controller = $controllerProvider.register;   //needed to dynamically load items
        elastetic.directive = $compileProvider.directive;
        elastetic.filter = $filterProvider.register;
        elastetic.factory = $provide.factory;
        elastetic.service = $provide.service;

        elastetic.requires.push()

    }]);

elastetic.run(function ($rootScope, $location, $state, AuthService, $mdToast, $transitions) {

        var match = {
            to: function(state){
                return state.restricted;
            }
        };
        $transitions.onStart(match, function(trans) {
            if (!AuthService.isLoggedIn()) {
                // User isn't authenticated. Redirect to a new Target State
                return $state.target('login');
            }
        });

        $transitions.onError({}, function(trans) {
            $rootScope.addError(trans.error());
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
        };

        var id = null;
        $rootScope.getId = function(){
            if (!id) id = sessionStorage.getItem('id');
            return id;
        };

        $rootScope.setId = function(userId) {
            id = userId;
            sessionStorage.setItem('id', userId);
        };
});
