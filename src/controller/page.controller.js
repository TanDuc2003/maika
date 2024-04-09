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

let handleUserLogin = async (req, res) => {
  const { email, userID, access_token } = req.body;
  try {
    const response = await pageServices.handleUserLoginServices(
      userID,
      access_token,
      email
    );
    if (response) {
      res.status(200).json({
        status: 200,
        message: response,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUserWithPageData,
  handleUserLogin,
};
