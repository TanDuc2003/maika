const fetch = require("node-fetch");

let fetchTripConfig = async (apiUrl, accessToken) => {
  const headers = {
    accept: "application/json, text/plain, */*",
    "accept-language": "vi-VN",
    authorization: `bearer ${accessToken}`,
    Referer: "https://vexere.com/",
  };

  try {
    const response = await fetch(apiUrl, {
      headers: headers,
      method: "GET",
    });
    if (!response.ok) return;

    const config = await response.json();
    return config.data;
  } catch (error) {
    console.error("Lỗi khi lấy cấu hình từ API:", error);
    throw error;
  }
};

let getToken = async () => {
  try {
    const response = await fetch("https://vexere.com/getToken", {
      method: "POST",
    });
    console.log("access_token", response);
    return response.json();
  } catch (error) {
    console.error("Lỗi khi lấy cấu hình từ API:", error);
    throw error;
  }
};

module.exports = { fetchTripConfig, getToken };
