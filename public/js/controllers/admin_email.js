/**
 * Created by elastetic.dev on 5/06/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict'

elastetic.controller('AdminEmailController',
    ['$scope', 'messages', '$http', '$stateParams', '$mdDialog', 'toolbar',
        function ($scope, messages, $http, $stateParams, $mdDialog, toolbar) {




            toolbar.title = "email";
            toolbar.buttons = [
                {   tooltip: "Add a new template",
                    icon: "fa fa-plus-circle",
                    type: "font-icon",
                    click: function(ev){ $scope.addTemplate();},
                    ng_if: function() {return $scope.templatesSelected == true; }
                }
            ];



            $scope.mailConfig = {};
            $scope.plugin = {name: ""};
            $scope.emailPlugins = [];


			
            //get data from site for scope
			//--------------------------------------------------------------------------------------
            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/plugin/mail'})      //get the list of plugins for this site
            .then(function (response) {
					$scope.emailPlugins = response.data;
                },
                function (response) {
                    messages.error(response.data);
                }
            );

            //loads the data for the email plugin from the server.
            function loadPluginData(plugin){
                if(plugin) {
                    $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/data/' + plugin.name})      //get the list of plugins for this site
                        .then(function (response) {
                                if (response.data) {
                                    $scope.mailConfig = response.data;
                                    $scope.mailConfig.isNew = false;			//so we know if it is a new record or not.
                                    $scope.mailConfig.needsSave = false;
                                }
                                else {
                                    $scope.mailConfig = {isNew: true, needsSave: true};
                                }
                            },
                            function (response) {
                                messages.error(response.data);
                            }
                        );
                }
                else
                    $scope.mailConfig = {isNew: true, needsSave: true};
            }

            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/plugin/mail/default' })
            .then(
                function (response) {
                    if(response.data) {
                        $scope.plugin = response.data;
                        loadPluginData(response.data);
                    }
                },
                function (response) {
                    messages.error(response.data);
                }
            );
			
			
			//html callbacks.
			//--------------------------------------------------------------------------------------

            $scope.pluginChanged = function(plugin){
                $http({method: 'PUT', url: '/api/site/' + $stateParams.site + '/plugin/mail/default', data: {value: plugin.name}})
                    .then(function (response) {
                            loadPluginData(plugin);
                        },
                        function (response) {
                            messages.error(response.data);
                        }
                    );
            };



            $scope.saveEmailConfig = function(toSave){
                if(toSave.isNew === true){
                    $http({method: 'POST', url: '/api/site/' + $stateParams.site + '/data/' + $scope.plugin.name, data: toSave})      //get the list of groups that can view
                        .then(function (response) {
                                toSave.needsSave = false;
                                toSave.isNew = false;
                            },
                            function (response) {
                                messages.error(response.data);
                            }
                        );
                }
                else {
                    $http({method: 'PUT', url: '/api/site/' + $stateParams.site + '/data/' + $scope.plugin.name, data: toSave})      //get the list of groups that can view
                        .then(function (response) {
                                toSave.needsSave = false;
                            },
                            function (response) {
                                messages.error(response.data);
                            }
                        );
                }
            }

            //scope vars
            //--------------------------------------------------------------------------------------

            $scope.templates = [];

            //get data from site for scope
            //--------------------------------------------------------------------------------------
            $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/templates/email'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
                .then(function (response) {
                        $scope.templates.push.apply($scope.templates, response.data);
                    },
                    function (response) {
                        messages.error(response.data);
                    }
                );


            //html callbacks.
            //--------------------------------------------------------------------------------------

            $scope.addTemplate = function(){
                $scope.templates.push({name: "new template", isOpen: true, needsSave: true, isNew: true});
            }

            $scope.saveTemplate = function(template){
                if(template.isNew){
                    $http({method: 'POST', url: '/api/site/' + $stateParams.site + '/templates/email', data: template})      //get the list of groups that can view
                        .then(function (response) {
                                template.isNew = false;
                                template.needsSave = false;
                            },
                            function (response) {
                                messages.error(response.data);
                            }
                        );

                }
                else{
                    $http({method: 'PUT', url: '/api/site/' + $stateParams.site + '/templates/email/' + template._id, data: template})      //get the list of groups that can view
                        .then(function (response) {
                                template.needsSave = false;
                            },
                            function (response) {
                                messages.error(response.data);
                            }
                        );
                }
            }

            $scope.delete = function(template, ev) {

                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm()
                    .title('Delete')
                    .textContent('Are you certain you want to delete this template?.')
                    .ariaLabel('delete')
                    .targetEvent(ev)
                    .ok('yes')
                    .cancel('no');

                $mdDialog.show(confirm).then(function () {
                    if (!template.isNew) {                                                  //its a real record, needs to be deleted from the server.
                        $http({method: 'DELETE', url: '/api/site/' + $stateParams.site + '/templates/email/' + template._id})      //get the list of groups that can view
                            .then(function (response) {
                                    $scope.templates.splice($scope.templates.indexOf(template), 1);
                                },
                                function (response) {
                                    messages.error(response.data);
                                }
                            );
                    }
                    else
                        $scope.templates.splice($scope.templates.indexOf(template), 1);

                }, function () {
                });
            }

        }
    ]
);