const mongoose = require("mongoose");
const pageModel = require("./page.model");

const userSchema = new mongoose.Schema({
  userId: String,
  email: String,
  listPage: [pageModel.schema],
});

module.exports = mongoose.model("User", userSchema);
