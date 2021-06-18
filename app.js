require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/users");
const connectDb = require("./helpers/connectDb");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use("/api/user", userRoutes);

connectDb()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server is running at port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
