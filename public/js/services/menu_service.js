/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict';

deebobo.factory('menu', [
    '$location', '$state','$stateParams',
    function ($location, $state, $stateParams) {

        var sections = [{
            name: 'Getting Started',
            view: 'gettingstarted',
            type: 'link'
        }];

        sections.push({
            name: 'Administration',
            type: 'toggle',
            pages: [{
                name: 'General',
                type: 'link',
                url: 'site.general',
                //url: 'site.page',
                icon: 'fa fa-wrench'
            }, {
                name: 'Email',
                type: 'link',
                url: 'site.email',
                icon: 'fa fa-envelope'
            }, {
                name: 'Authorization',
                type: 'link',
                url: 'site.authorization',
                icon: 'fa fa-user-circle'
            }, {
                name: 'connections',
                url: 'site.connections',
                type: 'link',
                icon: 'fa fa-cloud'
            }, {
                name: 'Plugins',
                url: 'site.plugins',
                type: 'link',
                icon: 'fa fa-plug'
            }]
        });


        sections.push({
            name: 'Pages',
            type: 'toggle',
            pages: [{
                name: 'test',
                type: 'link',
                page: 'home.beers.ipas',
                icon: 'fa fa-group'
            }, {
                name: 'test2 page',
                page: 'home.beers.porters',
                type: 'link',
                icon: 'fa fa-map-marker'
            }, {
                name: 'Wheat',
                page: 'home.beers.wheat',
                type: 'link',
                icon: 'fa fa-plus'
            }]
        });

        sections.push({
            name: 'Views',
            type: 'toggle',
            pages: [{
                name: 'Cheetos',
                type: 'link',
                view: 'munchies.cheetos',
                icon: 'fa fa-group'
                }, {
                    name: 'Banana Chips',
                    view: 'munchies.bananachips',
                    type: 'link',
                    icon: 'fa fa-map-marker'
                },
                {
                    name: 'Donuts',
                    view: 'munchies.donuts',
                    type: 'link',
                    icon: 'fa fa-map-marker'
                }]
        });


        sections.push({
            name: 'Functions',
            type: 'toggle',
            pages: [{
                name: 'Cheetos',
                type: 'link',
                view: 'munchies.cheetos',
                icon: 'fa fa-group'
            }, {
                name: 'Banana Chips',
                view: 'munchies.bananachips',
                type: 'link',
                icon: 'fa fa-map-marker'
            },
                {
                    name: 'Donuts',
                    view: 'munchies.donuts',
                    type: 'link',
                    icon: 'fa fa-map-marker'
                }]
        });


        var self;

        return self = {

            sections: sections,

            /**
             * placeholder for a callback function called when the user has selected a menu item
             */
            onselect: null,

            /**
             * for opening/closing groups
             */
            toggleSelectSection: function (section) {
                self.openedSection = (self.openedSection === section ? null : section);
            },

            /**
             * is a section selected or not
             * @param section
             * @returns {boolean}
             */
            isSectionSelected: function (section) {
                return self.openedSection === section;
            },

            /**
             * selects a view on the currently opened section.
             * @param view
             */
            select: function (view) {
                if(view ) {
                    if(view.hasOwnProperty('view'))  //it's a regular nested view
                    {
                        $state.go( 'site.page.view', { view: view.view});

                    }
                    else if(view.hasOwnProperty('page'))        //go to a different page within this site.
                    {
                        $state.go( 'site.page', {page: view.page});
                    }
                    else if(view.hasOwnProperty('url'))
                    {
                        $state.go(view.url, {site: $stateParams.site});
                    }
                    else{
                        console.log("invalid menu type");
                        return;
                    }
                    if(self.onselect)
                        self.onselect();
                }

            }
        };
    }]
);

