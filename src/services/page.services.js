const User = require("../models/user.model");

let createUserServices = async (userId, email, listPage) => {
  const filter = { userId };
  const update = { userId, email, listPage };
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  try {
    if (!Array.isArray(listPage) || listPage.length === 0)
      return {
        status: 400,
        data: { message: "ListPage must be a non-empty array" },
      };
    const result = await User.findOneAndUpdate(filter, update, options);
    if (result) {
      return { status: 200, data: { message: "User created successfully" } };
    } else {
      return { status: 400, data: { message: "User already exists" } };
    }
  } catch (error) {
    return { status: 500, data: { message: "Internal server error" } };
  }
};

let getLongTokenUserServices = async (accessTokenUser) => {
  const client_secret = process.env.CLIENT_SECRET;
  let url = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=617274822270137&grant_type=fb_exchange_token&client_secret=${client_secret}&fb_exchange_token=${accessTokenUser}`;
  try {
    const response = await fetch(url, {
      method: "GET",
    });
    console.log(response);
    if (!response.ok) {
      return {
        status: 500,
        data: { message: "Error request api Facebook" },
      };
    }
    const responseData = await response.json();
    const longAccessTokenUser = responseData.access_token;

    return {
      status: 200,
      data: { accessTokenUser: longAccessTokenUser },
    };
  } catch (error) {
    return {
      status: 500,
      data: { error: error.message },
    };
  }
};

module.exports = {
  createUserServices,
  getLongTokenUserServices,
};
