/**
 * Created by Deebobo.dev on 2/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

deebobo.directive('dbbMap', ['$timeout',
        function ($timeout) {
        return {
            template: '<div flex></div>',
            restrict: 'E',
            replace: true,
            scope:{
                pointsOfInterest: '=poi',
                routes: '=routes',
                zoom: '=zoom',
                center: '=center',
                mapType: '=mapType'
            },
            link: function(scope, element, attrs) {

                function addWatches(){
                    scope.$watch('zoom', function(newValue, oldValue) {
                        if(newValue){
                            map.setZoom(newValue);
                        }
                    });

                    scope.$watch('center', function(newValue, oldValue) {
                        if(newValue){
                            var center = new google.maps.LatLng(newValue[0], newValue[1]);
                            map.setCenter(center);
                        }
                    });

                    scope.$watch('mapType', function(newValue, oldValue) {
                        if(newValue)
                            map.setMapTypeId(newValue);
                    });

                    scope.$watchCollection('pointsOfInterest', function(newValues, oldValues) {
                        if(newValues)
                            addMarkers(newValues);
                        if(newValues != oldValues && oldValues)                          //update, need to check on this for the first time, othewise we remove newly added items
                            removeMarkersFromMap(oldValues);
                    });

                    scope.$watchCollection('routes', function(newValues, oldValues) {
                        if(newValues)
                            addRoutes(newValues);
                        if(newValues != oldValues && oldValues)                          //update, need to check on this for the first time, othewise we remove newly added items
                            removeRoutes(oldValues);
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
                    return map;
                }

                function addMarkers(values){
                    for(i=0; i < values.length; i++){
                        var value = values[i];
                        if(value.marker)                        // if there is any previous marker associated with the value, make certain that it is gone.
                            value.marker.setMap(null);
                        value.marker = {
                            marker: new google.maps.Marker({   // this is the marker at the center of the accuracy circle
                                title: value.title,
                                position: value.pos,
                                map: map
                            }),
                            circle: new google.maps.Circle({    // this is the accuracy circle
                                map: map,
                                center: value.pos,
                                radius: value.accuracy,
                                strokeWeight: 0.5,
                                strokeColor: 'white',
                                fillColor: 'lightblue',
                            })
                        };
                    }
                }

                function removeMarkersFromMap(values){
                    for(i=0; i < values.length; i++) {
                        var value = values[i];
                        if(value.marker){
                            value.marker.marker.setMap(null);
                            value.marker.circle.setMap(null);
                            value.marker = null;
                        }
                    }
                }

                function addRoutes(values){
                    for(i=0; i < values.length; i++){
                        var value = values[i];
                        if(value.route)                        // if there is any previous marker associated with the value, make certain that it is gone.
                            value.route.setMap(null);
                        value.route = new google.maps.Polyline({   // this is the marker at the center of the accuracy circle
                                path: value.path,
                                geodesic: true,
                                strokeColor: '#FF0000',
                                strokeOpacity: 1.0,
                                strokeWeight: 2
                            });
                        value.route.setMap(map);
                    }
                }

                function removeRoutes(values){
                    for(i=0; i < values.length; i++) {
                        var value = values[i];
                        if(value.route){
                            value.route.setMap(null);
                            value.route = null;
                        }
                    }
                }


                map =createMap();
                $timeout( function(){ google.maps.event.trigger(map,'resize'); }, 0 ); //need this to refresh the map after switching between views, otherwise we get a gray area
                addWatches();
            }
        };
    }]);



deebobo.factory('dbbMapService',
    ['$q',  function ($q) {

        return ({                                                       // return available functions for use in controllers
            addPointToRoute: addPointToRoute
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
    }]
);