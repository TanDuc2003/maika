require("dotenv").config();
const pageServices = require("../services//page.services");

let createUserWithPageData = async (req, res) => {
  try {
    const { userId, email, listPage } = req.body;
    const result = await pageServices.createUserServices(
      userId,
      email,
      listPage
    );
    return res.status(result.status).json({
      status: result.status,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

let getLongTokenUser = async (req, res) => {
  const { access_token } = req.body;
  const client_secret = process.env.CLIENT_SECRET;
  let url = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=617274822270137&grant_type=fb_exchange_token&client_secret=${client_secret}&fb_exchange_token=${access_token}`;
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
  createUserWithPageData,
  getLongTokenUser,
};
