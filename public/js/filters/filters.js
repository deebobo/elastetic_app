/**
 * Created by Deebobo.dev on 5/06/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */
/**
 * custom angular filters.
 */


deebobo.
    //take all whitespace out of string (used by the menu)
    filter('nospace', function () {
        return function (value) {
            return (!value) ? '' : value.replace(/ /g, '');
        };
    })
    //replace uppercase to regular case  (used by the menu)
    .filter('humanizeDoc', function () {
        return function (doc) {
            if (!doc) return;
            if (doc.type === 'directive') {
                return doc.name.replace(/([A-Z])/g, function ($1) {
                    return '-' + $1.toLowerCase();
                });
            }

            return doc.label || doc.name;
        };
    });

