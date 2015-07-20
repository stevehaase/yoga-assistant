var loggedIn = require('../middleware/loggedIn');
var mongoose = require('mongoose');
require('../models/blogpost');
require('../models/comment');

var BlogPost = mongoose.model('BlogPost');
var Comment = mongoose.model('Comment');

module.exports = function(app) {

	//create
	app.get('/post/create', loggedIn, function(req, res){
		res.render('post/create.jade');
	})

	app.post('/post/create', loggedIn, function(req, res){
		var body = req.body.body;
		var title = req.body.title;
		var user = req.session.user;

		BlogPost.create({
			body: body,
			title: title,
			author: user
			}, function(err, post){
				if (err) return next(err);
				res.redirect('/post/' + post.id);
		});
		
	})

	//read
	app.get('/post/:id', function(req, res, next){
		var id = req.params.id;
		
		var promise = BlogPost.findComments(id).sort('created').select('-_id').exec();
		var query = BlogPost.findById(id).populate('author');

		query.exec(function(err, post){
			if (err) return next(err);
			if (!post) return next();

			res.render('post/view.jade', {post: post, comments: promise});
		})
	})

	//delete
	app.get('/post/remove/:id', function(req, res, next){
		var id = req.params.id;

		BlogPost.findOne({_id: id}, function(err, post){
			if (err) next(err);
			if (post.author != req.session.user){
				return res.send(403);
			}
			post.remove(function(err){
				if (err) return next(err);
				res.redirect('/');
			});
		})
	})
	
	//edit
	app.get('/post/edit/:id', loggedIn, function(req, res, next){
		BlogPost.findById(req.params.id, function(err, post){
			if (err) next(err)
			res.render('post/create.jade', {post: post})
		})
	})
	app.post('/post/edit/:id', loggedIn, function(req, res, next){
		BlogPost.edit(req, function(err){
			if (err) return next(err)
			res.redirect('/post/' + req.params.id);
		})
	})
	app.post('/post/comment/:id', loggedIn, function(req, res, next){
		var id = req.params.id;
		var text = req.body.text;
		var author = req.session.user;

		Comment.create({
			post: id,
			text: text,
			author: author},
			function(err, comment){
				if (err) return next(err);
				res.redirect('/post/' + id);
		})
	})
}
