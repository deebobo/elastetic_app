/**
 * Created by Deebobo.dev on 20/05/2017.
 * copyright 2017 Deebobo.dev
 * See the COPYRIGHT file at the top-level directory of this distribution
 */

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const users = require('./routes/users');
const groups = require('./routes/groups');

const pluginMan = require('./plugin_manager');

/**
 * loads all the plugins
 */
async function loadPlugins(){
    let result = new pluginMan();
    result.initPluginMonitor();
    result.load();
    result.db.connect();
    result.db.createDb();                                   //make certain that the db is initialized properly
    return result;
}

/**
 * initialize the app middle ware and views.
 */
function initApp(){
    // view engine setup
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
}

var app = express();
app.set('plugins',loadPlugins());
initApp();
initPaths();

function initPaths() {
    app.use('/', index);
    app.use('/users', users);
    app.use('/groups', groups);

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });
}



module.exports = app;
