require("dotenv").config();
const User = require("../models/user.model");
let savePageDataToMongo = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, email, listPage } = req.body;
    console.log("====================================");
    console.log(userId);
    console.log(listPage);
    console.log("====================================");
    if (!Array.isArray(listPage) || listPage.length === 0)
      return res
        .status(400)
        .json({ error: "ListPage must be a non-empty array" });
    //check existingPage  userId
    let existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const newUser = new User({ userId, email, listPage });
    await newUser.save();
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error create User", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

let getLongTokenUser = async (req, res) => {
  const accessTokenUser = req.body.access_token;
  const client_secret = process.env.CLIENT_SECRET;
  let url = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=617274822270137&grant_type=fb_exchange_token&client_secret=${client_secret}&fb_exchange_token=${accessTokenUser}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      return res.status(500).json({
        statusCode: response.status,
        error: response.statusText,
      });
    }

    const responseData = await response.json();
    const longAccessTokenUser = responseData.access_token;

    return res.status(200).json({ accessTokenUser: longAccessTokenUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  savePageDataToMongo,
  getLongTokenUser,
};
