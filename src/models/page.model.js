const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  pageId: Number,
  accessToken: String,
});

module.exports = mongoose.model("Page", pageSchema);
