/**
 * Created by Jan Bogaerts on 22/10/2017.
 * copyright 2017 elastetic
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict';

elastetic.directive('noSpaces', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            attrs.ngTrim = 'false';

            element.bind('keydown', function(e) {
                if (e.which === 32) {
                    e.preventDefault();
                    return false;
                }
            });

            ngModel.$parsers.unshift(function(value) {
                var spacelessValue = value.replace(/ /g, '');

                if (spacelessValue !== value) {
                    ngModel.$setViewValue(spacelessValue);
                    ngModel.$render();
                }

                return spacelessValue;
            });
        }
    };
});