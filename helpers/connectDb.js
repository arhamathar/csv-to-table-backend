const mongoose = require("mongoose");

const connectDb = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log("Database Connected.");
	} catch (err) {
		console.log(err);
	}
};

module.exports = connectDb;
