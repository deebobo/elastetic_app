deebobo.factory("messages", function($rootScope){
    return {
        error: function(message){
            return function(reason){
                $rootScope.addError({message: message, reason: reason})

                /*$mdToast.show($mdToast.simple()
                    .textContent(message)
                    //.action('ok')
                    //.highlightAction(true)
                    //.highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                    .position("top right")
                    .hideDelay(3000));*/

            };
        }
    };
});