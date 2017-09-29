/**
 * Created by elastetic.dev on 28/05/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
'use strict';

elastetic.factory('UserService',
    ['$q', '$http', 'User', '$stateParams', function ($q, $http, User, $stateParams) {
		
		var rec = {                                                       
            user: null,														//this value is populated by auth_service upon login
			update: update,
			isAuthorizedFor: isAuthorizedFor,
            isAuthorizedToEdit: isAuthorizedToEdit
        };

	
		/* updates the user record and copies the new data into the global user object.
		*/
		function update(value, callback){
			User.update(value, function(){
				angular.copy(value, rec.user);
				if(callback)
                    callback();
			});
		} 
		
		/** returns true if the currently logged-in user can view the resource.
			resource {Object} a view, connection or page
		*/
		function isAuthorizedFor(resource){
			if(rec.user){
				for(let i = 0; i < rec.user.groups.length; i++){
					let item = rec.user.groups[i];											//need to use counter  into array, cause otherwise we iterate over every property of the array as wel, which we don't want.
					if( item.level === 'admin')
						return true;
					if (resource.groups.find((el) => el._id === item._id || el.level === 'public') !== -1)			//public resources are always allowed to be viewed.
						return true;
				}
			}
			return false;
		}
		
		/** returns true if the currently logged-in user can edit the resource.
			resource {Object} a view, connection or page
		*/
		function isAuthorizedToEdit(resource){
			if(rec.user){
				for(let i = 0; i < rec.user.groups.length; i++){
					let item = rec.user.groups[i];											//need to use counter  into array, cause otherwise we iterate over every property of the array as wel, which we don't want.
					if( item.level === 'admin')
						return true;
					if (item.level === 'edit' && resource.groups.find((el) => el._id === item._id ) !== -1)
						return true;
				}
			}
			return false;
		}

        return (rec);
	}]
);	