/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */



angular.module("deebobo").controller('particlIODevicesViewController',
    ['$scope', 'messages', '$http', '$stateParams', 'viewData', 'toolbar', 'UserService'
    function ($scope, messages, $http, $stateParams, viewData, toolbar, UserService) {

        toolbar.title = "particle.io devices";
        toolbar.buttons = [];

        $scope.devices = [];

        $scope.selected = [];                       //the selected devices.


        var particle = new Particle();

        $http({method: 'GET', url: '/api/site/' + $stateParams.site + '/connection?' + viewData.plugin._id})      //get the list of projects for this user, for the dlgopen (not ideal location, for proto only
            .then(function (response) {
                    for(i=0; i < response.data.length; i++){
						var connection = response.data[i];
                        if(connection.plugin.name === "particle_io" && UserService.isAuthorizedFor(connection)){	//only list particle.io resources and only when current user is allowed, when not allowed, we get errors, taht we don't want.
                            if( "content" in connection && "token" in connection.content){
                                particle.listDevices({ auth: connection.token }).then(
                                    function(result){
                                        if(result.statusCode == 200){
                                            $scope.gridDef.data = result.body;
                                        }
                                    },
                                    function(err){
                                        messages.error(err);
                                    }
                                );
                            }
                            else{
                                messages.error("invalid particle.io connection definition found in: " + response.data[i].name);
                            }
                        }
                    }
                },
                function (response) {
                    messages.error(response.data);
                }
            );

		$scope.gridDef = {
			enableSorting: true,
			columnDefs: [
			  { field: 'name' },
			  { field: 'status' },
			  { field: 'connected' },
			  { field: 'last_heard' },
			  { field: 'cellular' },
			  { field: 'current_build_target' },
			  { field: 'last_ip_address' },
			  { field: 'product_id' },
			],
			onRegisterApi: function( gridApi ) {
			  $scope.gridApi = gridApi;					//need this reference if we want to do something with the api on this grid from javascript.
			}
		  };

    }]);

//console.log("working");

