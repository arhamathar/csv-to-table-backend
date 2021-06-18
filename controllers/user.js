const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const userSignup = async (req, res, next) => {
	const { name, email, password } = req.body;
	let hasUser;

	try {
		hasUser = await User.findOne({ email });
	} catch (error) {
		return res
			.status(500)
			.json({ error: "Signed Up failed, please try again !" });
	}

	if (hasUser) {
		return res
			.status(500)
			.json({ error: "Signed Up failed, user already exists." });
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 10);
	} catch (err) {
		return res
			.status(500)
			.json({ error: "Could not create user, please try again!" });
	}

	const newUser = new User({
		name,
		email,
		password: hashedPassword,
	});

	try {
		await newUser.save();
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ error: "Creating new user failed, please try again!" });
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
		return res
			.status(500)
			.json({ error: "Creating new user failed, please try again!" });
	}

	res.status(201).json({
		userId: newUser.id,
		email: newUser.email,
		token: token,
	});
};

exports.userSignup = userSignup;
