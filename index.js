require("dotenv").config();
const hasher = require("./hasher.js");
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.resolve(__dirname, "static")));

app.get("/verify", (res, req) => {
	if(res.query.name && res.query.role && res.query.type) res.send(hasher(res.query.name, res.query.role, res.query.type));
	else res.sendStatus(400);
});

app.listen(process.env.PORT || 3000);