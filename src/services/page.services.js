const fetch = require("node-fetch");
const User = require("../models/user.model");

require("dotenv").config();

async function createUserServices(userId, email, listPage) {
  if (!Array.isArray(listPage) || listPage.length === 0) {
    return {
      status: 400,
      data: { message: "ListPage must be a non-empty array" },
    };
  }

  const filter = { userId };
  const update = { userId, email, listPage };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  try {
    const result = await User.findOneAndUpdate(filter, update, options);
    if (result) {
      return { status: 200, data: { message: "User created successfully" } };
    } else {
      return { status: 400, data: { message: "User already exists" } };
    }
  } catch (error) {
    console.error("Error createUserServices:", error);
    return { status: 500, data: { message: "Internal server error" } };
  }
}

async function handleUserLoginServices(userID, accessToken, email) {
  try {
    const longAccessTokenUser = await getLongAccessTokenUser(accessToken);
    if (longAccessTokenUser) {
      const fbUserData = await getFbUserData(longAccessTokenUser);
      if (fbUserData) {
        await processUserPages(fbUserData.data, userID, email);
      }
    }
  } catch (error) {
    console.error("Error handleUserLoginServices:", error);
  }
}

async function getLongAccessTokenUser(accessTokenUser) {
  const clientSecret = process.env.CLIENT_SECRET;
  const url = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=617274822270137&grant_type=fb_exchange_token&client_secret=${clientSecret}&fb_exchange_token=${accessTokenUser}`;

  try {
    const response = await fetch(url);
    const responseData = await response.json();
    return responseData.access_token;
  } catch (error) {
    console.error("Error getLongAccessTokenUser:", error);
    return null;
  }
}

async function getFbUserData(longAccessTokenUser) {
  const url = `https://graph.facebook.com/v19.0/me/accounts?fields=id,access_token,name,link&access_token=${longAccessTokenUser}`;

  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Error getFbUserData:", error);
    return null;
  }
}

async function processUserPages(pagesData, userID, email) {
  try {
    const listPage = pagesData.map((item) => ({
      page_id: item.id,
      access_token: item.access_token,
      name: item.name,
    }));
    const createUserResult = await createUserServices(userID, email, listPage);
    return createUserResult;
  } catch (error) {
    console.error("Error processUserPages:", error);
    return { status: 500, data: { message: "Internal server error" } };
  }
}

module.exports = {
  createUserServices,
  handleUserLoginServices,
};
