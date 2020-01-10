var User = require('../models/user');
const { check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const bcrypt = require("bcryptjs");

exports.index = (req, res) => { 
	res.render("index", { user: req.user });
};

exports.sign_up_get = (req, res) => res.render("sign-up-form");

exports.sign_up_post = (req, res, next) => {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(req.body.password, salt, function(err, hash){
			const user = new User({
				username: req.body.username,
				password: hash
			}).save(err => {
				if (err) { 
					return next(err);
				};
				res.redirect("/");
			});
		})		
	});	
}

exports.log_out = (req, res) => {
	req.logout();
	res.redirect("/");
}