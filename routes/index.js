var errors = require('./errors');
var login = require('./login');
//var posts = require('./posts');
//var BlogPost = mongoose.model('BlogPost');
var mongoose = require('mongoose');


module.exports = function(app){
        //home page
        app.get('/', function(req, res, next){
                res.render('home.jade');
        })
        login(app);
        //posts(app);
        errors(app);
}