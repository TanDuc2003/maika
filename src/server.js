const httpsLocalhost = require("https-localhost");
const pageController = require("./controller/page.controller");
const chartController = require("./controller/chart.controller");
const bodyParser = require("body-parser");
const express = require("express");
const connectRedis = require("./config/connect.redis");
const { connectDBArango } = require("./config/connect.arango.db");

let app = httpsLocalhost();
app.use(bodyParser.json());
connectRedis();
connectDBArango();
app.use(express.static("src/public"));
app.get("/getToken", pageController.getAccessToken);
app.post("/getData", pageController.fetchTicketsFromHTML);
app.get("/getInfo", pageController.getTripInfo);
app.get("/getChart", chartController.getChart);

app.listen();
