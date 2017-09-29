/**
 * Created by elastetic.dev on 5/06/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict';

elastetic.factory('menu', [
    '$location', '$state','$stateParams', '$rootScope', 'UserService', 'View', 'Page', '$q',
    function ($location, $state, $stateParams, $rootScope, UserService, View, Page, $q) {

        var self = {

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

		//goes over the sections and checks if the current user has access to the resource. If not, it is hidden. For folders that
		//no longer have items. hide the folder.
		//returns true if any of the items is still accessible. If none of the items in the list can be used, returns false.
		//internally, this function gets the views and pages (so that a fresh list is available, and then passes the work on to the internal version 
		function setMenuAccessibility(list){
			
			//get the data, but save: it is fetched async, and we need to wait until both ops are done before evaluating the list
			var views, pages = null;																//keep these global for the other functions, so both lists remain seperate
			function getViews(){
				var d = $q.defer();
				views = View.query({site: $stateParams.site},
					function(){	 
						d.resolve();																	//called when done
					}
				);
				return d.promise;
			}
			
			function getPages(){
				var d = $q.defer();
				pages = Page.query({site: $stateParams.site},
					function(){	 
						d.resolve();																	//called when done
					}
				);
				return d.promise;
			}
		
			$q.all([
			   getViews(),
			   getPages()
			]).then(function(data) {
				//checks if the item references a page or a view. if so, return the object that represents the view or page.
				function getResourceFor(item){
					var resource = null;
					var name = null;
					if(item.hasOwnProperty('view')){  //it's a regular nested view
						resource = views;
						name = item.view;
					}
					else if(item.hasOwnProperty('page')){        //go to a different page within this site.
						resource = pages;
						name = item.page;
					}
					if(resource){
						var index = views.find((el) => el.name == name)
						if(index >= 0) return views[index];
					}
					return null;
				}
					
				//does the actual work for setMenuAccessibility
				function internalSetMenuAccessibility(list){
					var res = false;
					for(let i = 0; i < list.length; i++){
						var item = list[i];
						if(item.type === 'link'){
							var resource = getResourceFor(item);
							if(resource)															//only page and view resources have limited access.
								item.allowed = UserService.isAuthorizedFor(resource);
							else
								item.allowed = true;
						}
						else if(item.type === 'toggle')
							item.allowed = internalSetMenuAccessibility(item.pages);
						else
							item.allowed = true;
						if(item.allowed == true)
							res = true;
					}
					return res;
				}
				internalSetMenuAccessibility(list);
			});
		}

        //whenever the list of menu items or the user changes, update the list of sections so that only accessible items are visible for the user.
        $rootScope.$watch(function() { return self.sections; },
            function watchCallback(newValue, oldValue) { if(newValue && newValue.length > 0) setMenuAccessibility(self.sections); });
        $rootScope.$watch(function() { return UserService.user; },
            function watchCallback(newValue, oldValue) { if(newValue && newValue.length > 0) setMenuAccessibility(self.sections); });

        return self
    }]
);

