var mongoose = require('mongoose');
var passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy;
require('../models/users');
var User = mongoose.model('User');

var cleanString = require('../helpers/cleanString');
var hash = require('../helpers/hash');
var crypto = require('crypto');

module.exports = function(app){

	app.get('/signup', function(req, res){
		res.render('signup.jade');
	});

	//create new account
	app.post('/signup', function(req, res, next){
		var email = req.body.email;
		var pass = req.body.pass;
		if (!(email && pass)) {
			return invalid();
		}

		User.findById(email, function(err, user){
			if (err) return next(err);
			
			if (user) {
				return res.render('signup.jade', {exists: true});
			}

			crypto.randomBytes(16, function(err, bytes){
				if (err) return next(err);
				var user = {_id: email};
				user.salt = bytes.toString('utf8');
				user.hash = hash(pass, user.salt);
			
				User.create(user, function(err, newUser){
					if (err) {
						if (err instanceof mongoose.Error.ValidationError){ return invalid(); }
					return next(err);
					}
					req.session.isLoggedIn = true;
					req.session.user = email;
					console.log('created user: %s', email);
					return res.redirect('/');		
		
				});
			});
		});

		function invalid(){
			return res.render('signup.jade', {invalid: true});
		}
	});
	
	app.get('/login', function(req, res){
		res.render('login.jade');
	});

	app.post('/login', function(req, res){
		var email = req.body.email;
		var pass = req.body.pass;
		if (!(email && pass)) {
			return invalid();
		}

		email = email.toLowerCase();

		User.findById(email, function(err, user){
			if (err) return next(err);

			if (!user) return invalid();

			if (user.hash != hash(pass, user.salt)) return invalid();

			req.session.isLoggedIn = true;
			req.session.user = email;
			return res.redirect('/');
		});
		function invalid() {
			return res.render('login.jade', {invalid: true});
		}
	})

	app.get('/logout', function(req, res){
		req.session.isLoggedIn = false;
		req.session.user = null;
		res.redirect('/');
	})
}
