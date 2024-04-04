const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("DB connection successful.");
    })
    .catch((err) => {
      console.log(`DB connection error:${err}`);
    });
};
module.exports = connectDB;
