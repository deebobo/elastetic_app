/**
 * Created by Deebobo.dev on 25/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const winston = require('winston');

const appAuth =  require('../routes/app_authentication');
const users =    require('../routes/users');
const groups =   require('../routes/groups');
const auth =     require('../routes/site_authentication');
const sites =    require('../routes/sites');
const routes =    require('../routes/index');
const express =  require('express');

let router = express.Router({mergeParams: true});

function initPaths(app, passport) {
    app.use('/', routes);
    app.use('/api', appAuth);
	app.use('/api/sites', sites);
    app.use(router.use('/api/:site', auth));
    app.use(router.use('/api/:site/users', passport.authenticate('jwt', { session: false }), users));
    app.use(router.use('/api/:site/groups', passport.authenticate('jwt', { session: false }), groups));

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        winston.log("error", err);
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
}

module.exports = initPaths;