const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server is running at port ${PORT}`);
});
