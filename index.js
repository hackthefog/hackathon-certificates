require("dotenv").config();
const hasher = require("./hasher.js");
const express = require("express");
const path = require("path");
const ejsTemplate = pathBit => path.resolve(__dirname, "templates", pathBit);
const app = express();

app.set('view engine', 'ejs');

app.get("/verify", (req, res) => {
	if(res.query.name && res.query.role && res.query.type) res.send(hasher(res.query.name, res.query.role, res.query.type));
	else res.sendStatus(400);
});

const validTypes = ["HacktheCloud"];
app.get("/", (req, res) => {
	const urlData = {
		name: req.query.name,
		role: req.query.role,
		type: req.query.type,
		key: Number(req.query.key)
	};

	if(!validTypes.includes(urlData.type)) return res.status(400).send("Invalid Type");

	if(!urlData.name || !urlData.role || !urlData.type || !urlData.key) {
		// Query String Values Are Required
		return res.status(400).send("Invalid URL");
	}

	if(hasher(urlData.name, urlData.role, urlData.type) !== urlData.key) return res.status(400).send("Hash Does Not Match");

	return res.render(ejsTemplate("template"), { data: urlData });
});

app.use(express.static(path.resolve(__dirname, "static")));

app.listen(process.env.PORT || 3000);