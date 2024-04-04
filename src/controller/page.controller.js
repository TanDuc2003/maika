const Page = require("../models/page.model");

let savePageDataToMongo = async (req, res, next) => {
  let id = req.body.pageId;
  let accessToken = req.body.accessToken;

  console.log("====================================");
  console.log(id);
  console.log(accessToken);
  console.log("====================================");
  if (!accessToken || !id) {
    return res.status(400).json({ error: "accessToken and id are required." });
  }
  try {
    let existingPage = await Page.findOne({ pageId: id });

    if (existingPage) {
      if (existingPage.accessToken !== accessToken) {
        console.log("update accessToken");
        existingPage.accessToken = accessToken;
        await existingPage.save();
        console.log("Page data updated in MongoDB successfully.");
        return res
          .status(200)
          .json({ message: "Page data updated in MongoDB successfully." });
      } else {
        console.log("Page data already exists in MongoDB.");
        return res
          .status(200)
          .json({ message: "Page data already exists in MongoDB." });
      }
    } else {
      const newUser = new Page({
        pageId: id,
        accessToken: accessToken,
      });
      await newUser.save();
      console.log("Page data saved to MongoDB successfully.");
      return res
        .status(200)
        .json({ message: "Page data saved to MongoDB successfully." });
    }
  } catch (error) {
    console.error("Error saving/updating Page data to MongoDB:", error);
    return res
      .status(500)
      .json({ error: "Error saving/updating Page data to MongoDB." });
  }
};

module.exports = {
  savePageDataToMongo: savePageDataToMongo,
};
