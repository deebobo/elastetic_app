/**
 * Created by Deebobo.dev on 21/07/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

'use strict';

deebobo
    .factory('View', ["$resource", 'messages',
	function ($resource, messages) {
		
		function resourceErrorHandler(response){
			messages.error(response.data);
		}

        return $resource('/api/site/:site/view/:id', 
		                 { id: '@name', 
						   site: '@site'
						 }, 
						 {
							update: {
							  method: 'PUT', // this method issues a PUT request
							  interceptor : {responseError : resourceErrorHandler}
							},
							get: {
								method:'GET', 
								interceptor : {responseError : resourceErrorHandler}
							},
							save:{
								method:'POST',
								interceptor : {responseError : resourceErrorHandler}
							},
							query: {
								method:'GET', 
								isArray:true, 
								interceptor : {responseError : resourceErrorHandler}
							},
							remove: {
								method:'DELETE',
								interceptor : {responseError : resourceErrorHandler}
							},
							'delete': {
								method:'DELETE',
								interceptor : {responseError : resourceErrorHandler}
							}
						  }
						);
    }]);