const express = require("express");
const app = express();
port = 3000;

const cors = require("cors");
const corsMiddleware = cors();
app.use(corsMiddleware);

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
app.use(jsonParser);

const movieRouter = require("./router");
app.use(movieRouter);

let count = 0;

function countMiddleware(req, res, next) {
	count++;
	if (count > 5) {
		return res.status(429).send({
			success: false,
			message: "Request exceeded 5"
		});
	}
	if (next) next();
}

app.use(countMiddleware);

app.post("/messages", (req, res, next) => {
	if (!req.body.hasOwnProperty("text")) {
		return res.status(400).send({
			success: false,
			message: "message property does not exist"
		});
	}
	if (req.body.text === "") {
		return res.status(400).send({
			success: false,
			message: "Empty text received"
		});
	}

	console.log(req.body.text);
	res.send({ message: req.body.text });
});

app.listen(port, () => {
	console.log("Listening on port", +port);
});
