const express = require("express");
const app = express();
port = 3000;

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
app.use(jsonParser);

let count = 0;

function countMiddleware(req, res, next) {
	console.log("count,", count);
	console.log(next);
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
	console.log("post", req.body);

	if (!req.body.hasOwnProperty("text")) {
		return res.status(400).send({
			success: false,
			message: "Text property does not exist"
		});
	}
	if (req.body.text === "") {
		return res.status(400).send({
			success: false,
			message: "Empty text received"
		});
	}

	res.send(req.body.text);
});

app.listen(port, () => {
	console.log("Listening on port", +port);
});
