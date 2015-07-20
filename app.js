var mongoose = require('mongoose');
var express = require('express');
var routes = require('./routes');
var middleware = require('./middleware');
/*var models = require('./models');
require('express-mongoose');
require('./models/blogpost');
require('./models/users');
require('./models/comment');*/

mongoose.connect('mongodb://localhost', function(err){
        if (err) throw err;
        console.log('we connected');

        var app = express();
        middleware(app);
        routes(app);

        app.listen(3000, function(){
                console.log('now listening on http://localhost:3000');

        });
});