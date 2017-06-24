deebobo.factory("messages", function($rootScope){
    return {
        error: function(message){
            return function(reason){
                $rootScope.addError({message: message, reason: reason})
            };
        }
    };
});