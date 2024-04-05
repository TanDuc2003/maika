const httpsLocalhost = require("https-localhost");
const express = require("express");
const connectDB = require("./config/connect.db");
const pageController = require("./controller/page.controller");
const bodyParser = require("body-parser");

let app = httpsLocalhost();
app.use(bodyParser.json());
connectDB();

app.use("/static", express.static("src/public"));
app.post("/post-page", pageController.savePageDataToMongo);
app.post("/getLongTokenUser", pageController.getLongTokenUser);

app.listen();
