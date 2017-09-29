elastetic
    .directive('menuToggle', ['$timeout', "menu", function ($timeout, menu) {
        return {
            scope: {
                section: '='
            },
            templateUrl: 'partials/menu_toggle.html',
            link: function (scope, element) {

                scope.isOpen = function () {
                    return menu.isSectionSelected(scope.section);
                };
                scope.toggle = function () {
                    menu.toggleSelectSection(scope.section);        //note: 'page' has been remapped to 'section' on this scope. this is done in html: <menu-link section="page"></menu-link>
                };

                var parentNode = element[0].parentNode.parentNode.parentNode;
                if (parentNode.classList.contains('parent-list-item')) {
                    var heading = parentNode.querySelector('h2');
                    element[0].firstChild.setAttribute('aria-describedby', heading.id);
                }
            }
        };
    }]);