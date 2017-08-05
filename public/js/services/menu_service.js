/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict';

deebobo.factory('menu', [
    '$location', '$state','$stateParams',
    function ($location, $state, $stateParams) {

        var self;

        return self = {

            sections: [],

            /**
             * the name of the homepage, filled in by app.js, used in case we don't have a stateparam.page
             */
            homepage: null,
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
                        $state.go( 'site.page.view', { site: $stateParams.site, page: $stateParams.page || self.homepage, view: view.view});
                    else if(view.hasOwnProperty('page'))        //go to a different page within this site.
                        $state.go( 'site.page', {site: $stateParams.site, page: view.page});
                    else if(view.hasOwnProperty('state'))
                        $state.go(view.state, {site: $stateParams.site, page: $stateParams.page || self.homepage});
                    else if(view.hasOwnProperty('url'))
                        $location.path(view.url);
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

