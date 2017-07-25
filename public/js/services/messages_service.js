deebobo.factory("messages", function($rootScope){
    return {
        error: function(message){
            $rootScope.addError(message);
        }
    };
});