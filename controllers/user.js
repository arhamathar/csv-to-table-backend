const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/users");

const userSignup = async (req, res, next) => {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		res.status(422);
		return next(
			new Error("Invalid data entered, please enter data correctly")
		);
	}

	const { name, email, password } = req.body;

	let hasUser;
	try {
		hasUser = await User.findOne({ email });
	} catch (error) {
		res.status(500);
		return next(new Error("Signed Up failed, please try again !"));
	}

	if (hasUser) {
		res.status(500);
		return next(new Error("Signed Up failed, User already exist !"));
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 10);
	} catch (err) {
		res.status(500);
		return next(new Error("Could not create user, please try again !"));
	}

	const newUser = new User({
		name,
		email,
		password: hashedPassword,
	});

	try {
		await newUser.save();
	} catch (error) {
		res.status(500);
		return next(new Error("Creating new user failded, please try again !"));
	}

	try {
		token = jwt.sign(
			{ userId: newUser._id, email: newUser.email },
			process.env.JWT_SECRET_KEY,
			{
				expiresIn: "1h",
			}
		);
	} catch (error) {
		res.status(500);
		return next(new Error("Creating new user failded, please try again !"));
	}

	res.status(201).json({
		message: "Sign Up Successful",
		userId: newUser.id,
		email: newUser.email,
		token: token,
	});
};

const userLogin = async (req, res, next) => {
	const { email, password } = req.body;

	let identifiedUser;
	try {
		identifiedUser = await User.findOne({ email });
	} catch (error) {
		res.status(500);
		return next(new Error("Logging In failed, please try again !"));
	}

	if (!identifiedUser) {
		res.status(403);
		return next(new Error("User not found , please check email."));
	}

	let isValidUser = false;
	try {
		isValidUser = await bcrypt.compare(password, identifiedUser.password);
	} catch (err) {
		console.log(err);
		res.status(500);
		return next(
			new Error(
				"Could not log you in, please check your credentials and try again."
			)
		);
	}

	if (!isValidUser) {
		res.status(401);
		return next(
			new Error("Invalid password entered, please try again later")
		);
	}

	try {
		token = jwt.sign(
			{ userId: identifiedUser._id, email: identifiedUser.email },
			process.env.JWT_SECRET_KEY,
			{
				expiresIn: "1h",
			}
		);
	} catch (error) {
		res.status(500);
		return next(new Error("Logging user failed, please try again!"));
	}

	res.status(200).json({
		message: "Login Successful",
		userId: identifiedUser.id,
		email: identifiedUser.email,
		token: token,
	});
};

exports.userLogin = userLogin;
exports.userSignup = userSignup;
