/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */



angular.module("deebobo").controller('googleMapViewController', [
    '$scope', 'connectionDataService', 'messages','$http', '$stateParams', '$mdSidenav', 'dbbMapService',
    function ($scope, connectionDataService, messages, $http, $stateParams, $mdSidenav, dbbMapService) {

        var particle = new Particle();
		var connections = null;										//store ref to all the connections, so we can load the data again.

        $scope.mapCenter = [43.6650000, -79.4103000];
        $scope.zoom = 8;
        $scope.pointsOfInterest = [
            {
                title: "test point",
                pos: {lat: 50.5039, lng: 4.4699},
                accuracy: 5
            }
        ];

        $scope.routes = [
           /* {
                path: [
                    {lat: 37.772, lng: -122.214},
                    {lat: 21.291, lng: -157.821},
                    {lat: -18.142, lng: 178.431},
                    {lat: -27.467, lng: 153.027}
                ]
            }*/
        ];

        $scope.devices = {};                         //a dict of routes per device, so we can load the data quickly.
        $scope.isOpen = false;
		$scope.Start = 0;							//start & end time of data for filtering.
		$scope.End = 0;
		$scope.filter = { from: {date: 0, time: 0}, to: {date: 0, time: 0} };

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
                                        storeRoutePoint(data);
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
					connections = response.data;
                    response.data.forEach((connection) => {
                        loadRoutes(connection, {});
                        tryRegisterParticleEventStream(connection);
                    })
                },
                function (response) {
                    messages.error(response.data);
                }
            );

        //retrieves all the routes from the server async and renders the data.
        function loadRoutes(connection, params){
			params.pagesize = 50;
            function loadRouteSection(page){
				params.page = page;
                connectionDataService.get(connection._id, params).then(
                    function(data) {
                        storeRoutePoints(data);
                        if(data.length === 50)                                   //as long as we have a full record set, try to get a next set.
                            loadRouteSection(page + 1);
                        else
                            fit_map_to_devices();                               //make everything fit nice.
                        },
                    function(err){messages.error(err);}
                )
            }
            loadRouteSection(0);
        }

        /**
         * sorts the data per device and renders them on the graph.
         * @param data
         */
        function storeRoutePoints(data){
            for(var i=0; i < data.length; i++){
                var point = data[i];
                storeRoutePoint(point);
            }
        }

        function storeRoutePoint(point){
            var coordinates = JSON.parse(point.data).split(',');
            var data = new google.maps.LatLng(parseFloat(coordinates[0]), parseFloat(coordinates[1]));
            if($scope.devices.hasOwnProperty(point.device)){            //existing device
                $scope.devices[point.device].path.push(data);
                dbbMapService.addPointToRoute($scope.devices[point.device], data);
            }
            else{
                var newList = {path:[ data]};
                $scope.devices[point.device] = newList;
                $scope.routes.push(newList);
            }
			var time = new Date(point.time);
			if(time < $scope.Start)
				$scope.Start = time;
			if(time > $scope.End)
				$scope.End = time;
        }


        function fit_map_to_devices() {
            // make sure all the markers are visible on the map
            var bounds = new google.maps.LatLngBounds();
			var routes = $scope.routes;
			var found = false;
            for (var i=0; i < routes.length; i++) {
				var route = routes[i];
                if(route.route){
                    bounds.union(route.route.getBounds());
					found = true;
				}
            }
			if(found)
				map.fitBounds(bounds);
        }


        $scope.togglerFilterMenu = function(){
            $mdSidenav("filterMenu").toggle();
        };
		
		//only show the data that matches the filter.
		$scope.applyFilter = function(){
			params = {from: $scope.filter.from.date + $scope.filter.from.time, to: $scope.filter.to.date + $scope.filter.to.time};
			connections.forEach((connection) => {
				loadRoutes(connection, params);
			});
		};

        $scope.openMenu = function($mdMenu, ev) {
            originatorEv = ev;
            $mdMenu.open(ev);
        };


    }]);

