/**
 * Created by elastetic.dev on 2/07/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
"use strict"

elastetic.directive('dbbMap', ['$timeout',
        function ($timeout) {
        return {
            template: '<div flex></div>',
            restrict: 'E',
            replace: true,
            scope:{
                pointsofinterest: '=poi',
				showcurrent: '=showcurrent',			//when true, the current/latest location for each route is shown.
                routes: '=routes',
                zoom: '=zoom',
                center: '=center',
                mapType: '=mapType',
				editable: '=editable',
				drawpois: '=drawpois',				//are points of interest shown or not
				drawpoints: '=drawpoints',				// individual points of routes
                drawroutes: '=drawroutes',
				onpoimoved: '&',						//this is an expression, parameter for the expression: marker
				ondeletepoi: '&',						//called when user wants to delete/blacklist a poi
				onrenamepoi: '&', 						//called when user wants to rename a poi
				onaddpoi: '&', 							//called when user wants to add a poi, param = location
            },
            link: function(scope, element, attrs) {
				
				//image used to display the current location
				var curLocImage = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

                /**
                 * V3 lost this function, so we add it again.
                 */
                if (!google.maps.Polyline.prototype.getBounds) {
                    google.maps.Polyline.prototype.getBounds = function () {
                        var bounds = new google.maps.LatLngBounds();
                        this.getPath().forEach(function (element, index) { bounds.extend(new google.maps.LatLng(element.lat(), element.lng())); });
                        return bounds;
                    }
                }

                function addWatches(){
                    scope.$watch('zoom', function(newValue, oldValue) {
                        if(newValue){
                            map.setZoom(newValue);
                        }
                    });
					
					scope.$watch('showcurrent', function(newValue) {
                        if(newValue)
                            showCurrentLoc();
                        else
                            hideCurrentLoc();
                    });

                    scope.$watch('drawroutes', function(newValue) {
                        if(newValue)
                            showRoutes();
                        else
                            hideRoutes();
                    });

                    scope.$watch('center', function(newValue, oldValue) {
                        if(newValue){
                            var center = new google.maps.LatLng(newValue[0], newValue[1]);
                            map.setCenter(center);
                        }
                    });

                    scope.$watch('maptype', function(newValue, oldValue) {
                        if(newValue)
                            map.setMapTypeId(newValue);
                    });

                    scope.$watchCollection('pointsofinterest', function(newValue, oldValue) {

                        if (newValue.length > oldValue.length) {
                            addMarkers(_.difference(newValue, oldValue));
                        } else {
                            removeMarkersFromMap(_.difference(oldValue, newValue));
                        }
                    });

                    scope.$watchCollection('routes', function(newValue, oldValue) {
                        if (newValue.length > oldValue.length) {
                            addRoutes(_.difference(newValue, oldValue));
                        } else {
                            removeRoutes(_.difference(oldValue, newValue));
                        }
                    });
					
					
					scope.$watch('drawpoints', function(newValue, oldValue) {
                        if(newValue)
                            showPoints();
                        else
                            hidePoints();
                    });

                    scope.$watch('drawpois', function(newValue, oldValue) {
                        if(newValue)
                            showPois();
                        else
                            hidePois();
                    });


                }

                function createMap(){
                    var latlng = null;
                    if(scope.center)
                        latlng = new google.maps.LatLng(scope.center[0], scope.center[1]);
                    else
                        latlng = new google.maps.LatLng(-34.397, 150.644);
                    var mapOptions =
                        {
                            zoom: scope.zoom || 2,
                            center: latlng,
                            mapTypeId: scope.mapType || google.maps.MapTypeId.ROADMAP,
                        };
                    var map = new google.maps.Map(element[0], mapOptions);
                    var center = map.getCenter();
                    google.maps.event.trigger(map, "resize");
                    map.setCenter(center);

                    map.addListener('dblclick', function(mouseEvent) {		//we get a google.maps.MouseEvent
                        if (typeof (scope.onaddpoi) == 'function') 					//raise event/ callback
                            scope.onaddpoi({location: mouseEvent.latLng});
                    });

                    return map;
                }

                function addMarkers(values){
                    for(var i=0; i < values.length; i++){
                        var value = values[i];
                        if(value.marker)                        // if there is any previous marker associated with the value, make certain that it is gone.
                            value.marker.setMap(null);
                        value.location = new google.maps.LatLng(value.lat, value.lng);
                        value.marker = new google.maps.Marker({   // this is the marker at the center of the accuracy circle
                                title: value.name,
                                position: value.location,
								draggable: scope.editable,				//allow the user to relocate the markers when enough rights
                        });
						if(scope.drawpois)
							value.marker.setMap(map);
						attachEventListenersToMarker(value);
                    }
                }
				
				function getPoiMarkerContent(marker){
					var text = 'name: ' + marker.name + '<br/>' + 
							  'latitude: ' + marker.lat + '<br/>' + 
							  'longitude: ' + marker.lng + '<br/>' + 
							  'last visited: ' + marker.time + '<br/>' + 
							  'total time spend at poi: ' + marker.duration + '<br/>' + 
							  'nr of visits: ' + marker.count + '<br/>';
					
					var content=document.createElement('div'), button;
					content.innerHTML=text;
					button=content.appendChild(document.createElement('input'));
					button.type='button';
					button.value='Delete'
					google.maps.event.addDomListener(button,'click', function(){ scope.ondeletepoi({marker});})
					
					button=content.appendChild(document.createElement('input'));
					button.type='button';
					button.value='rename'
					google.maps.event.addDomListener(button,'click', function(){ scope.onrenamepoi({marker, onPoiRenamed});})
					
					return content;
				}

                /**
                 * callback for the onrenamepoi event. This allows the google map to update the marker.
                 * @param marker
                 * @param value
                 */
				function onPoiRenamed(marker, value){
                    infoWindow.close();
                    marker.marker.setTitle(value);
                }
				
				//attaches the callback to the circle. This is in a function so we can use closures
				function attachEventListenersToMarker(marker){
					if(scope.editable){
						marker.marker.addListener('dragend', function(mouseEvent) {		//we get a google.maps.MouseEvent
							marker.location = mouseEvent.latLng;
							marker.lat = marker.location.lat();
							marker.lng = marker.location.lng();
							if(scope.onpoimoved)							//raise event/ callback
								scope.onpoimoved({marker: marker});
						});
						marker.marker.addListener('click', function() {
							infoWindow.setContent(getPoiMarkerContent(marker));
							infoWindow.open(marker.marker.get('map'), marker.marker);
						});
					}
				}

                function removeMarkersFromMap(values){
                    for(var i=0; i < values.length; i++) {
                        var value = values[i];
                        if(value.marker){
                            value.marker.setMap(null);
                            value.marker = null;
                        }
                    }
                }

                //this function gets attached to a route, so it can add points
                function addPointToRoute(value, point){
                    if(value.route) {
                        var path = value.route.getPath();
                        path.push(point);
                        value.route.setPath(path);
                    }
                    if(value.circles){
                        var circle = new google.maps.Circle({
                            strokeColor: value.color,
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: value.color,
                            fillOpacity: 0.35,
                            center: point,
                            radius: 15						//radius is expressed in meters, User the acurratie of gps
                        });
                        value.circles.push(circle);				//for future reference, so we can show/hide
                        if(scope.drawpoints)
                            circle.setMap(map);
                        attachEventListenerToPoint(circle, value, point);
                    }
					//reset the current location, if it has changed.
					if(value.current == point){							//there is a new current location
						if(value.currentLoc){                        		// if there is any previous map associated with the value, make certain that it is gone.
							value.currentLoc.setPosition(point);
						}
						else{
							value.currentLoc = new google.maps.Marker({   // this is the marker at the center of the accuracy circle
									title: value.name,
									position: value.current,
									icon: curLocImage
							});
							if(scope.showcurrent)
								value.currentLoc.setMap(map);
						}
					}
                }

                //this function gets attached to a route, so it can refresh the colors
                function refreshOptions(device){
                    if(device.route) {
                        device.route.setOptions({strokeColor: device.color})
                    }
                    if(device.circles) {
                        for(var i = 0; i < device.circles.length; i++){
                            var circle = device.circles[i];
                            circle.setOptions({fillColor: device.color, strokeColor: device.color,});
                        }
                    }
                }


                function addRoutes(values){
                    for(var i=0; i < values.length; i++){
                        var value = values[i];
                        if(value.route)                        		// if there is any previous map associated with the value, make certain that it is gone.
                            value.route.setMap(null);
                        if(value.circles){
                            for(var i = 0; i < value.circles.length; i++)
                                value.circles[i].setMap(null);
                        }
                        value.addPointToRoute = addPointToRoute;     //provide the callback for adding new points
                        value.refreshOptions = refreshOptions;

                        value.route = new google.maps.Polyline({   	// always create the object, so we can hide or show as needed (possible optimization: only render if requested)?
                                path: value.path,
                                geodesic: true,
                                strokeColor: value.color,
                                strokeOpacity: 1.0,
                                strokeWeight: 2
                            });
						if(scope.drawroutes)						//only display on map if requested
							value.route.setMap(map);
						value.circles = [];								//init to empty list of circles
						for(var i = 0; i < value.path.length; i++){	//also render each point
							var circle = new google.maps.Circle({
									strokeColor: value.color,
									strokeOpacity: 0.8,
									strokeWeight: 2,
									fillColor: value.color,
									fillOpacity: 0.35,
									center: value.path[i],
									radius: 15						//radius is expressed in meters, User the acurratie of gps
								  });
							value.circles.push(circle);				//for future reference, so we can show/hide
							if(scope.drawpoints)
								circle.setMap(map);
							attachEventListenerToPoint(circle, value, value.path[i]);
						}
						if(value.current){							//there is a current location, should always be the case
							if(value.currentLoc)                        		// if there is any previous map associated with the value, make certain that it is gone.
								value.currentLoc.setMap(null);
								
							value.currentLoc = new google.maps.Marker({   // this is the marker at the center of the accuracy circle
									title: value.name,
									position: value.current,
									icon: curLocImage
							});
							if(scope.showcurrent)
								value.currentLoc.setMap(map);
						}
                    }
                }
				
				//attaches the callback to the circle. This is in a function so we can use closures
				function attachEventListenerToPoint(circle, devInfo, point){
					circle.addListener('click', function() {
						infoWindow.setContent("device: " + devInfo.device + "</br>latitude: " + point.lat() + "</br>longitude: " + point.lng()  + "</br>time: " + point.time);
						infoWindow.setPosition(point);
                        infoWindow.open(circle.get('map'), circle);
					});
				}
				
				function showRoutes(){
					for(var i = 0; i < scope.routes.length; i++){
						if(scope.routes[i].isActive == true){										//only display if the individual route wasn't turned off.
							scope.routes[i].route.setMap(null);									//remove from previous, if any.
							scope.routes[i].route.setMap(map);
						}
					}
				}
				
				function hideRoutes(){
					for(var i = 0; i < scope.routes.length; i++){
						scope.routes[i].route.setMap(null);									//remove from previous, if any.
					}
				}
				
                function removeRoutes(values){
                    for(var i=0; i < values.length; i++) {
                        var value = values[i];
                        if(value.route){
                            value.route.setMap(null);
                            value.route = null;
							for(var i = 0; i < value.circles.length; i++)
								value.circles[i].setMap(null);
							value.circles = null;
							value.currentLoc.setMap(null);
							value.currentLoc = null;
                        }
                    }
                }
				
				function showCurrentLoc(){
					for(var i = 0; i < scope.routes.length; i++){
						if(scope.routes[i].isActive == true){										//only display if the individual route wasn't turned off.
							scope.routes[i].currentLoc.setMap(null);									//remove from previous, if any.
							scope.routes[i].currentLoc.setMap(map);
						}
					}
				}
				
				function hideCurrentLoc(){
					for(var i = 0; i < scope.routes.length; i++){
						scope.routes[i].currentLoc.setMap(null);									//remove from previous, if any.
					}
				}
				
				
				function showPoints(){
					for(var i = 0; i < scope.routes.length; i++){
						if(scope.routes[i].isActive == true){										//only display if the individual route wasn't turned off.
							var route = scope.routes[i];
							for(var u = 0; u < route.circles.length; u++){
								route.circles[u].setMap(null);
								route.circles[u].setMap(map);
							}
						}
					}
				}
				
				function hidePoints(){
					for(var i = 0; i < scope.routes.length; i++){
						var route = scope.routes[i];
						for(var u = 0; u < route.circles.length; u++){
							route.circles[u].setMap(null);
						}
					}
				}

                function showPois(){
                    for(var i = 0; i < scope.pointsofinterest.length; i++){
                        scope.pointsofinterest[i].marker.setMap(map);
                    }
                }

                function hidePois(){
                    for(var i = 0; i < scope.pointsofinterest.length; i++){
                        scope.pointsofinterest[i].marker.setMap(null);
                    }
                }




                var map = createMap();
				var infoWindow = new google.maps.InfoWindow({});
                $timeout( function(){ google.maps.event.trigger(map,'resize'); }, 0 ); //need this to refresh the map after switching between views, otherwise we get a gray area
                addWatches();
            }
        };
    }]);



elastetic.factory('dbbMapService',
    ['$q',  function ($q) {

        return ({                                                       // return available functions for use in controllers
            addPointToRoute: addPointToRoute,
            removeRoute: removeRoute
        });


        /**
         * draws a new point on the map for the route
         * @param value {object} the route
         * @param point
         * @returns {Bluebird<R>}
         */
        function addPointToRoute(value, point){
            if(value.route) {
                var path = value.route.getPath();
                path.push(point);
                value.route.setPath(path);
            }
        }

        function removeRoute(value){
            value.route.setMap(null);
        }
    }]
);