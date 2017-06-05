/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict';

deebobo.factory('menu', [
    '$location',
    function ($location) {

        var sections = [{
            name: 'Getting Started',
            view: 'gettingstarted',
            type: 'link'
        }];

        sections.push({
            name: 'Administration',
            type: 'toggle',
            pages: [{
                name: 'Users',
                type: 'link',
                view: 'users',
                icon: 'fa fa-group'
            }, {
                name: 'Groups',
                page: 'groups',
                type: 'link',
                icon: 'fa fa-plus'
            }, {
                name: 'Plugins',
                view: 'plugins',
                type: 'link',
                icon: 'fa fa-map-marker'
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

            homeController: null,                           // a reference to the object that

            sections: sections,

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
                        if(homeController){
                            homeController.gotoView(view.page);
                        }
                        else
                            console.log('no home controller set')

                    }
                    else if(view.hasOwnProperty('page'))        //go to a different page within this site.
                    {
                        if(homeController){
                            homeController.gotoPage(view.page);
                        }
                        else
                            console.log('no home controller set')
                    }
                }
            }
        };
    }]
);

