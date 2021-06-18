require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const connectDb = require("./helpers/connectDb");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	next();
});

app.use("/api/user", userRoutes);

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}
	res.status(error.code || 500);
	res.json({
		message: error.message || "An unknown error occured.",
	});
});

connectDb()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running at port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
