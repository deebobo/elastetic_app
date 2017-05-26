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

const passport = require('passport');

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
let oauth2 = require('./libs/oauth2')(app);
require('./libs/auth');
app.post('/oauth/token', oauth2);
require('./libs/routes.js')(app, passport);




module.exports = app;
