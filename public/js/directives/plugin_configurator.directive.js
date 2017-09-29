/**
 * Created by elastetic.dev on 21/07/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict';

elastetic
    .directive('pluginconfigurator', ["pluginService", function (pluginService) {
        return {
            restrict: 'E',
            scope: {
                plugin: '=',
                value: '='
            },
            template: '<ng-include src="template" flex></ng-include>',
            link: function (scope, $element) {

                scope.$watch('plugin', function(newvalue) {
                    if(newvalue && newvalue.config){
                        pluginService.load(newvalue.config)
                            .then(function(){
                                scope.template = "plugins/" + newvalue.config.partials[0];

                            });
                    }
                    else{
                        scope.template = null;
                    }
                });

            }
        };
    }]);