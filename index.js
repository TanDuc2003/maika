const httpsLocalhost = require("https-localhost");
const express = require("express");
let app = httpsLocalhost();

app.use("/static", express.static("public"));

app.listen();
