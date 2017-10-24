/**
 * Created by elastetic.dev on 5/07/2017.
 * copyright 2017 elastetic.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */


elastetic
    .directive('jsonText', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            function into(input) {
                //console.log(JSON.parse(input));
				var res = "";
				try{
					res = JSON.parse(input)
				}
				catch(error){
					return;												//failed to parse it
				}
                return res;
            }
            function out(data) {
                return JSON.stringify(data);
            }
            ngModel.$parsers.push(into);
            ngModel.$formatters.push(out);
        }
    };
});