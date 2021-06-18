const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const userController = require("../controllers/user");

router.post(
	"/signup",
	[
		check("name").notEmpty(),
		check("email").isEmail().normalizeEmail(),
		check("password").isLength({ min: 6 }),
	],
	userController.userSignup
);

router.post("/login", userController.userLogin);

module.exports = router;
