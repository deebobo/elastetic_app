'use strict';

  elastetic
    .directive('menuLink', ["menu", function (menu) {
      return {
        scope: {
          section: '='
        },
        templateUrl: 'partials/menu_link.html',
        link: function ($scope, $element) {

          $scope.select= function () {
            menu.select($scope.section);
          };
        }
      };
    }]);