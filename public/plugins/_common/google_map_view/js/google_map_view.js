/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

"use strict";


angular.module("deebobo").controller('googleMapViewController', [
    '$scope', 'connectionDataService', 'messages','$http', '$stateParams', '$mdSidenav', 'dbbMapService', 'toolbar','$timeout', 'colorsList', '$mdDialog', 'UserService',
    function ($scope, connectionDataService, messages, $http, $stateParams, $mdSidenav, dbbMapService, toolbar, $timeout, colorsList, $mdDialog, UserService) {

        toolbar.title = "map";
        toolbar.buttons = [
            {   tooltip: "show the filter options",
                icon: "fa fa-filter",
                type: "font-icon",
				name: "show_filter_btn",
                click: function(ev){ $scope.togglerFilterMenu();}
            },
			
			{   tooltip: "show the visualisation options",
                icon: "fa fa-eye",
                type: "font-icon",
				name: "show_vis_options_btn",
                click: function(ev){ $scope.togglerVisualisationMenu();}
            }
			
        ];

        var particle = new Particle();
		var connections = [];										//store ref to all the connections, so we can load the data again.
		var dataPoints = [];										//the data points that we found in db, so we can re-render when options change.
        var poiConnection = null;                                   //stores a ref to the last poi connection that is found, so we can add items to it.


        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(pos => { $scope.mapCenter = [pos.coords.latitude, pos.coords.longitude];});
        else
            $scope.mapCenter = [43.6650000, -79.4103000];


        $scope.zoom = 8;
        $scope.pointsOfInterest = [];

        $scope.routes = [];

        $scope.devices = {};                         //a dict of routes per device, so we can load the data quickly.
        $scope.isOpen = false;
		$scope.Start = 0;							//start & end time of data for filtering.
		$scope.End = 0;
		$scope.totalNrDays = 0;                     //the total nr of days in the range (from-to), for the slider
		$scope.newFilter = { from: {date: new Date(), days: 0, hours: 0}, to:{date:new Date(), days: 0, hours: 0 }  };
        $scope.curFilter = { from: new Date(), to: new Date() };
		$scope.showPoints = false;				
		$scope.showRoutes = true;
		$scope.showPoi = false;
		$scope.colors = colorsList.colors;
		$scope.canEditMap = false;


        $scope.$watch('newFilter.from.hours', function(newVal) {
            var temp = new Date($scope.newFilter.from.date);
            temp.setHours(newVal);
            $scope.newFilter.from.date = temp;
        });

        $scope.$watch('newFilter.to.hours', function(newVal) {
            var temp = new Date($scope.newFilter.to.date);
            temp.setHours(newVal);
            $scope.newFilter.to.date = temp;
        });

        $scope.$watch('newFilter.from.days', function(newVal) {
            var temp = new Date($scope.Start);
            temp.setDate(temp.getDate() + newVal);
            temp.setHours($scope.newFilter.from.hours);
            $scope.newFilter.from.date = temp;
        });

        $scope.$watch('newFilter.to.days', function(newVal) {
            var temp = new Date($scope.End);
            temp.setDate(temp.getDate() - $scope.totalNrDays + newVal);
            temp.setHours($scope.newFilter.to.hours);
            $scope.newFilter.to.date = temp;
        });
		

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        //data
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////


        /**
         * if the connection is a particle.io connection, then register an event stream for each device.
         * Filter on devices cause otherwise we get a public stream, which contains all possible devices.
         * @param connection
         */
        function tryRegisterParticleEventStream(connection){
            if(connection.plugin.name === "particle_io") {
                particle.listDevices({auth: connection.content.token}).then(
                    function (result) {
                        if (result.statusCode == 200)
                            for (var i = 0; i < result.body.length; i++) {
                                particle.getEventStream({
                                    auth: connection.content.token,
                                    deviceId: result.body[i].id,
                                    name: "G"                                           //get all events with the name 'G' -> comes from default particle tracker  demo
                                }).then(function (stream) {
                                    stream.on('event', function (data) {
                                        data.device = data.coreid;
                                        renderPoint(data);
                                    });
                                });
                            }
                    },
                    function (err) {
                        messages.error(err);
                    }
                );
            }
        }

        //load the list of connections, so we can query every connection for data.
        $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/connection'})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
					for(var i = 0; i < response.data.length; i++){
						var con = response.data[i];
						if(UserService.isAuthorizedFor(con)){
							if(connection.plugin.name === 'my_sql_poi_data'){
								loadPois(connection, {});
								connections.push(con);
							}
							else if(connection.plugin.name === 'my_sql_historical_data'){
								loadHistData(connection);
								connections.push(con);
							}
						}
					}
                },
                function (response) {
                    messages.error(response.data);
                }
            );
			
		function loadHistData(connection){
			connectionDataService.getTimeRange(connection._id, {})
				.then(function(range){
					if(range && range.length > 0){                                              //there is data and we found a range
						range = {min: new Date(range[0].min), max: new Date(range[0].max) } ;   //we get a string (in an array of 1 rec), to calculate, we need date objects
						setTimeRange(range);
						var fromLocalStorage = tryReadDataFromLocalStorage(connection._id);
						if(fromLocalStorage){
							dataPoints = fromLocalStorage;
							renderPoints(fromLocalStorage);
						}
						else
							loadRoutes(connection, {});                                             //load all the data, we don't yet have enough filter info to select a single day (if there are multiple connections, the filter would be incorrect)
					}
					tryRegisterParticleEventStream(connection);
				},
				function(response){
					messages.error(response);
				}
			);
		}
		
		function loadPois(connection, params){
            poiConnection = connection;
			$scope.canEditMap = UserService.isAuthorizedToEdit(poiConnection);
			params.pagesize = 200;
			var toStore = [];															//for storing in the local storage
            function loadPoisSection(page){
				params.page = page;
                connectionDataService.get(connection._id, params).then(
                    function(data) {
                        $scope.pointsOfInterest.push.apply($scope.pointsOfInterest, data);
                        if(data.length === 200)                                   //as long as we have a full record set, try to get a next set.
                            loadPoisSection(page + 1);
                    },
                    function(err){messages.error(err);}
                )
            }
            loadPoisSection(0);
		}

        //stores the min amd max time range for a single connection. We check for the outer limits.
        function setTimeRange(range){
            if(! $scope.Start || $scope.Start > range.min )
                $scope.Start = range.min;
            if(! $scope.End || $scope.End < range.max )
                $scope.End = range.max;

            $scope.curFilter = {from: $scope.Start, to: $scope.End};
            $scope.newFilter.from.date = $scope.Start;
            $scope.newFilter.to.date = $scope.End;

            $scope.newFilter.from.hours = $scope.Start.getHours();
            $scope.newFilter.to.hours = $scope.End.getHours();

            $scope.totalNrDays = Math.ceil((((($scope.End - $scope.Start) / 1000) / 60) / 60) / 24);
            $scope.newFilter.from.days = 0;
            $timeout(function() {                                   //need to set this value through a timeout, cause otherwise it is not set correctly because of the totalNrDays being used as max value (bug in angular), this provides a workaround
                $scope.newFilter.to.days = $scope.totalNrDays;
            });
        }



        //retrieves all the routes from the server async and renders the data.
        function loadRoutes(connection, params){
			params.pagesize = 200;
			var toStore = [];															//for storing in the local storage
            function loadRouteSection(page){
				params.page = page;
                connectionDataService.get(connection._id, params).then(
                    function(data) {
                        var len = data.length;                                      //we need to see if we were at end of query or not, but the data list will be overwritten once it is rendered.
                        data = renderPoints(data);
						toStore.push.apply(toStore, data);
                        if(len === 200)                                   //as long as we have a full record set, try to get a next set.
                            loadRouteSection(page + 1);
                        else{
                            fit_map_to_devices();                               //make everything fit nice.
							dataPoints = toStore;
							tryStoreInLocalStorage(toStore, connection._id);
						}
                    },
                    function(err){messages.error(err);}
                )
            }
            loadRouteSection(0);
        }

        //only show the data that matches the filter.test
        $scope.applyFilter = function(){
            $scope.routes = [];                         //reset all the data. This will also clear the routes from the map
            $scope.devices = {};

            var params = {from: $scope.newFilter.from.date, to: $scope.newFilter.to.date};
            connections.forEach((connection) => {
                if(connection.plugin.name === 'my_sql_poi_data')
                    loadPois(connection, params);
                else if(connection.plugin.name === 'my_sql_historical_data')
                    loadRoutes(connection, params);
            });

            $scope.curFilter = {from: $scope.newFilter.from.date, to: $scope.newFilter.to.date};
        };


        $scope.setColor = function(device){
            device.refreshOptions(device);
        };


        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        //local storage
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////

		//if there is a local storage present, store the data so we can render it quickly next time that the user opens the app.
		function tryStoreInLocalStorage(data, id)
		{
            if(typeof(Storage) !== "undefined"){           //need to check if there is a local storage
                var data = { values: data, filter: $scope.curFilter };
                localStorage.setItem("Track&Trace-"+ id, JSON.stringify(data));
            }
		}

        /**
         * see if there is data stored in the local storage
         * @param id {string} the id of the connection.
         */
        function tryReadDataFromLocalStorage(id){
            if(typeof(Storage) !== "undefined"){           //need to check if there is a local storage
                var res = localStorage.getItem("Track&Trace-"+ id);
                if(res){
                    res =  JSON.parse(res);
                    $scope.curFilter = res.filter;
                    return res.data;
                }
            }
            return null;
        }



        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        //render map
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////

        /**
         * sorts the data per device and renders them on the graph.
         * @param data
         * @returns [List] of actually rendered and interesting points (so they can be stored in local storage for quick rendering on next load).
         */
        function renderPoints(data){
            var res = [];
            for(var i=0; i < data.length; i++){
                var point = data[i];
                if(point['field'] == 'G')               //could be that we are storing more then just gps coordinates in the db for a device.
                {
                    renderPoint(point);
                    res.push(point);
                }
            }
            return res;
        }
		

        function renderPoint(point){
            var coordinates = JSON.parse(point.data).split(',');
            var data = new google.maps.LatLng(parseFloat(coordinates[0]), parseFloat(coordinates[1]));
			data.time = point.time;								//attach time info to the point, so we can render the info later on.
            if($scope.devices.hasOwnProperty(point.device)){            //existing device
				var device = $scope.devices[point.device];
                device.path.push(data);
                if(device.addPointToRoute)                  //if it's been rendered before, render emmideatly, otherwise defer until it has been added to the map
                    device.addPointToRoute(device, data);     //draw on map
            }
            else{
                var newList = {path:[ data], color: "red", isActive: true, device: point.device };		//add device name to the info, so we can display it when clicking on points
                $scope.devices[point.device] = newList;
                $scope.routes.push(newList);
				//don't need to return the newList, it doesn't have to be reloaded, it has just been added.
            }
        }
		
		function renderPois(data){
			data.location = new google.maps.LatLng(data.lat, data.lng);
			//data.isActive = true;

		}


        function fit_map_to_devices() {
            // make sure all the markers are visible on the map
            var bounds = new google.maps.LatLngBounds();
			var routes = $scope.routes;
			var found = false;
			var map =  null;
            for (var i=0; i < routes.length; i++) {
				var route = routes[i];
				map = route.route.getMap();
                if(route.route){
                    bounds.union(route.route.getBounds());
					found = true;
				}
            }
			if(found && map)
				map.fitBounds(bounds);
        }



        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        //menu
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////

        $scope.togglerFilterMenu = function(){
            $mdSidenav("filterMenu").toggle();
        };

        $scope.openMenu = function($mdMenu, ev) {
            //originatorEv = ev;
            $mdMenu.open(ev);
        };

		
		$scope.togglerVisualisationMenu = function(){
            $mdSidenav("visualisationMenu").toggle();
        };
		
		////////////////////////////
		//callbacks
		////////////////////////////
		
		$scope.deletePoi = function(ev, poi){
			if(poiConnection && $scope.canEditMap){
				var confirm = $mdDialog.confirm()
					.title('Would you like to delete this point of interest?')
					.textContent('The location will be blacklisted so that it will not be regarded anymore as a possibible poi in the future.')
					.ariaLabel('Delete point of interest')
					.targetEvent(ev)
					.ok('Yes')
					.cancel('No');

				$mdDialog.show(confirm).then(function() {
					poi.blacklisted = true;
					let rec = {blacklisted: true, id: poi.id};
					connectionDataService.update(poiConnection._id, rec).then(
						function(data){
							$scope.pointsOfInterest.splice($scope.pointsOfInterest.indexOf(poi), 1);
						},
						function(err){
							messages.error(err);
						}
					);
				});
			}
		};
		
		$scope.showPoiRename = function(ev, poi, onDone){
            //ask for name
            if(poiConnection && $scope.canEditMap){
                var confirm = $mdDialog.prompt()
                    .title('Rename')
                    .textContent('How would you like to call the point-of-interest')
                    .placeholder('name')
                    .initialValue(poi.name)
                    .ariaLabel('rename')
                    .targetEvent(ev)
                    .ok('Ok')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(function(result) {
                    let record = {id: poi.id, name: result};
                    connectionDataService.update(poiConnection._id, record).then(
                        function(data){
                            poi.name = result;
                            onDone(poi, result);                    //let the map also update the UI
                        },
                        function(err){
                            messages.error(err);
                        }
                    );
                }, function() {
                });
            }
            else{
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title('Invalid operation')
                        .textContent("Can't store the point-of interest. Please first specify a connection to manage your poi data.")
                        .ariaLabel("Can't store poi data")
                        .ok('Ok')
                        .targetEvent(ev)
                );
            }
		};
		
		$scope.updatePoi = function(poi){
			if(poiConnection && $scope.canEditMap){
				let rec = {id: poi.id, name: poi.name, lat: poi.lat, lng: poi.lng, count: poi.count, duration: poi.duration};
				connectionDataService.update(poiConnection._id, rec).then(
					function(data){
						poi.name = data.name;
						poi.lat = data.lat;
						poi.lng = data.lng;
						poi.count = data.count;
						poi.duration = data.duration;
					},
					function(err){
						messages.error(err);
					}
				);
			}
		};
		
		$scope.addPoi = function(ev, location){
			//ask for name
			if($scope.canEditMap){
				if(poiConnection){
					var confirm = $mdDialog.prompt()
						.title('Name')
						.textContent('How would you like to call the new point-of-interest')
						.placeholder('name')
						.ariaLabel('name')
						.targetEvent(ev)
						.ok('Ok')
						.cancel('Cancel');

					$mdDialog.show(confirm).then(function(result) {
						var poi = { name: result, lat: location.lat(), lng: location.lng(), count: 0, duration: 0};        //location is for googlemap, lat-lng is for storage in server
						connectionDataService.post(poiConnection._id, poi).then(
							function(data){
								$scope.pointsOfInterest.push(data);
							},
							function(err){
								messages.error(err);
							}
						);
					}, function() {
					});
				}
				else{
					$mdDialog.show(
						$mdDialog.alert()
							.clickOutsideToClose(true)
							.title('Invalid operation')
							.textContent("Can't store the point-of interest. Please first specify a connection to manage your poi data.")
							.ariaLabel("Can't store poi data")
							.ok('Ok')
							.targetEvent(ev)
					);
				}
			}
		}

    }]);

