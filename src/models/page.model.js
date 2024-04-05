const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema(
  {
    page_id: String,
    access_token: String,
    name: String,
  },
  { _id: false }
);

module.exports = mongoose.model("Page", pageSchema);
