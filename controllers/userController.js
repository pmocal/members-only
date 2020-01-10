var User = require('../models/user');
const { check,validationResult } = require('express-validator');
const { sanitizeBody } = require('express-validator');
const bcrypt = require("bcryptjs");

exports.index = (req, res) => { 
	res.render("index", { user: req.user });
};

exports.sign_up_get = (req, res) => res.render("sign-up-form");

exports.sign_up_post = [
	// Validate fields.
	check('firstname', 'First name must not be empty.').isLength({ min: 1 }).trim(),
	check('lastname', 'Last name must not be empty.').isLength({ min: 1 }).trim(),
	check('username', 'Username must not be empty.').isLength({ min: 1 }).trim(),
	check('password', 'Password must not be empty').isLength({ min: 1 }).trim(),
	check('isMember', 'isMember must not be empty').isLength({ min: 1 }).trim(),

	// Sanitize fields (using wildcard).
	sanitizeBody('firstname').escape(),
	sanitizeBody('lastname').escape(),
	sanitizeBody('username').escape(),
	sanitizeBody('password').escape(),
	sanitizeBody('isMember').escape(),
	(req, res, next) => {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// There are errors. Render form again with sanitized values/error messages.
			res.render('sign_up_form');
			// , { title: 'Create Item', item: item, errors: errors.array() });
		}
		else {
			// Data from form is valid. Save book.
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(req.body.password, salt, function(err, hash) {
					const user = new User({
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

exports.log_out = (req, res) => {
	req.logout();
	res.redirect("/");
}