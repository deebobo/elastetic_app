/**
 * Created by Deebobo.dev on 27/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict';


angular.module('common.services', []);
angular.module('deebobo.controllers', ['common.directives']);
angular.module('common.directives', ['common.services']);

var deebobo = angular.module('deebobo', ['ui.router', 'ngMaterial',  'ui.bootstrap']);  //'ngMdIcons',




deebobo.config(['$stateProvider', '$locationProvider',
    function($stateProvider, $locationProvider) {
        //$locationProvider.hashPrefix('!');
        $stateProvider.state('home', {
                url: '',
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
                url: '/{site}',
                templateUrl: 'partials/site_home.html',
                controller: 'siteHomeController',
                access: {restricted: true}
            });
        $stateProvider.state('site.register', {
                url: '/{site}/register',
                templateUrl: 'partials/site_register.html',
                controller: 'siteRegisterController',
                access: {restricted: false}
            });
        $stateProvider.state('site.login', {
                url: '/{site}/login',
                templateUrl: 'partials/site_login.html',
                controller: 'siteLoginController',
                access: {restricted: false}
            });


        $stateProvider.state('site.page', {
            url: '/{site}/{page}',
            templateUrl: 'partials/page.html',
            controller: 'PageController',
            access: {restricted: false}
        });

        $stateProvider.state('site.page.view', {
            url: '/{site}/{page}/{view}',
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
                url:"*path",
                templateUrl: 'partials/error-not-found.html'
            });
    }]);

deebobo.run(function ($rootScope, $location, $state, AuthService) {
    $rootScope.$on('$stateChangeStart',
        function (event, next, current) {
            if ( (!next.access || next.access.restricted) && !AuthService.isLoggedIn()){
                $location.path('/login');
                $state.reload();
            }
        });
});

deebobo.run(function($rootScope) {
    $rootScope.$on("$stateChangeError", console.log.bind(console));
});
