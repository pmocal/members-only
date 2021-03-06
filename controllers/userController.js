var User = require('../models/user');
const { check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const bcrypt = require("bcryptjs");

exports.index = (req, res) => { 
	res.render("index", { user: req.user });
};

exports.sign_up_get = (req, res) => res.render("sign_up_form", { title: "Sign up form" });

exports.sign_up_post = [
	// Validate fields.
	check('firstname', 'First name must not be empty.').isLength({ min: 1 }).trim(),
	check('lastname', 'Last name must not be empty.').isLength({ min: 1 }).trim(),
	check('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
	check('password', 'Password must not be empty').isLength({ min: 1 }).trim(),
	check('passwordConfirmation').exists(),
	check('isMember', 'isMember must not be empty').isLength({ min: 1 }).trim(),

	// Sanitize fields (using wildcard).
	sanitizeBody('firstname').escape(),
	sanitizeBody('lastname').escape(),
	sanitizeBody('username').escape(),
	sanitizeBody('password').escape(),
	sanitizeBody('isMember').escape(),
	sanitizeBody('passwordConfirmation').escape(),
	check('passwordConfirmation', 'passwordConfirmation field must have the same value as the password field')
	    .exists()
	    .custom((value, { req }) => value === req.body.password),
	(req, res, next) => {
		// Extract the validation errors from a request.
		var user = new User({
			username: req.body.username,
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			isMember: req.body.isMember
		})
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render('sign_up_form', { title: "Signup form", user: user, errors: errors.array() });
			// , { title: 'Create Item', item: item, errors: errors.array() });
		}
		else {
			// Data from form is valid. Save book.
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(req.body.password, salt, function(err, hash) {
					user = new User({
						username: req.body.username,
						password: hash,
						firstname: req.body.firstname,
						lastname: req.body.lastname,
						isMember: req.body.isMember
					}).save(err => {
						if (err) { 
							return next(err);
						};
						res.redirect("/");
					});
				})		
			});
		}
	}
];

exports.join_get = (req, res) => {
	res.render("join_form", { title: "Join the club", user: req.user });
}

exports.join_post = [
	check('secret', 'secret must not be empty.').isLength({ min: 1 }).trim(),
	sanitizeBody('secret').escape(),
	(req, res, next) => {
		const errors = validationResult(req);
		var user = new User({
			username: req.user.username,
			password: req.user.password,
			firstname: req.user.firstname,
			lastname: req.user.lastname,
			isMember: "true",
			_id: req.user._id
		});
		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render('join_form', { title: "Join the club form", user: user, errors: errors.array() });
			// , { title: 'Create Item', item: item, errors: errors.array() });
		}
		if (req.body.secret === "42") {
			User.findByIdAndUpdate(req.user._id, user, {}, function (err, thecategory) {
				if (err) { return next(err); }
				res.render("index", { title: "welcome to the club" });
			})
		} else {
			res.render('join_form', { title: "Your application was rejected, try again", user: user });
		}
	}
];

exports.log_out = (req, res) => {
	req.logout();
	res.redirect("/");
}