var mongoose = require('mongoose');
var express = require('express');
var routes = require('./routes');
var middleware = require('./middleware');
/*var models = require('./models');
require('express-mongoose');
require('./models/blogpost');
require('./models/users');
require('./models/comment');*/
var port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost', function(err){
        if (err) throw err;
        console.log('we connected');

        var app = express();
        middleware(app);
        routes(app);

        app.listen(port, function(){
                console.log('now listening on ' + port);

        });
});