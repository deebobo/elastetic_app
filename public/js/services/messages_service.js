'use strict'
elastetic.factory("messages", function($rootScope){
    return {
        error: function(message){
            if(message)
                $rootScope.addError(message);
            else
                $rootScope.addError("unknown error");
        }
    };
});