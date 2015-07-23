var morgan = require('morgan');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var port = process.env.PORT || 3000;

module.exports = function(app){

        app.set(port);
        app.use(morgan('dev'));
        app.use(cookieSession({
                keys: ['key1', 'key2']
        }));
        app.use(session({secret: "help teachers"}));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        app.use(passport.initialize());
        app.use(passport.session());

        app.use(function(req, res, next){
                res.locals.session = req.session;
                //req.locals.isLoggedIn = req.session.isLoggedIn;
                next();
        });

}