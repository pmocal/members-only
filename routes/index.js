var express = require('express');
var router = express.Router();

require('dotenv').config()
const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var User = require('../models/user');
var user_controller = require('../controllers/userController');

passport.use(
	new LocalStrategy((username, password, done) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) { 
				return done(err);
			}
			if (!user) {
				return done(null, false, { msg: "Incorrect username" });
			}
			bcrypt.compare(password, user.password, (err, res) => {
				if (res) {
					return done(null, user);
				} else {
					return done(null, false, {msg: "Incorrect password"});
				}
			})
		});
	})
);

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

router.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
router.use(passport.initialize());
router.use(passport.session());
router.use(express.urlencoded({ extended: false }));

router.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

router.get("/", user_controller.index);

router.get("/sign-up", user_controller.sign_up_get);

router.post("/sign-up", user_controller.sign_up_post);

router.get("/join", user_controller.join_get);

router.post("/join", user_controller.join_post);

router.post(
	"/log-in",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/"
	})
);

router.get("/log-out", user_controller.log_out);

module.exports = router;
