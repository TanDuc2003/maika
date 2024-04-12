const { Database } = require("arangojs");
require("dotenv").config();

const databaseName = "maika-dev";

const db = new Database({
  url: process.env.ARANGO_URL,
  databaseName,
});

let connectDBArango = () => {
  db.listCollections().then(
    (collections) => console.log("connect db success!", collections),
    (err) => console.error("connect db error:", err)
  );
};

module.exports = { connectDBArango, db };
