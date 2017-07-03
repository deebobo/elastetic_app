/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */



angular.module("deebobo").controller('googleMapViewController', ['$scope',
    function ($scope) {

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
            {
                path: [
                    {lat: 37.772, lng: -122.214},
                    {lat: 21.291, lng: -157.821},
                    {lat: -18.142, lng: 178.431},
                    {lat: -27.467, lng: 153.027}
                ]
            }
        ];
    }]);

