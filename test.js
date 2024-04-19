// const pageController = require("./src/controller/page.controller");

// async function restAllDate() {
//   try {
//     const dates = [];
//     for (let i = 16; i <= 30; i++) {
//       const day = i < 10 ? `0${i}` : `${i}`;
//       dates.push(`${day}-04-2024`);
//     }

//     // const promises = dates.map(async (date) => {
//     const response = await fetch("getData", {
//       headers: { "Content-Type": "application/json" },
//       method: "POST",
//       body: JSON.stringify({ date: "16-04-2024" }),
//     });
//     const data = await response.json();
//     return data;
//     // });

//     const results = await Promise.allSettled(promises);
//     console.log("All requests completed:", results);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }


fun2();

// // restAllDate();
// function callAPI1(callback) {
//   // Gọi API 1
//   setTimeout(() => {
//     const data = { api1: "data" };
//     callback(null, data); // Gọi callback với dữ liệu hoặc lỗi
//   }, 1000); // Giả định API cần 1 giây để hoàn thành
// }

// function callAPI2(callback) {
//   // Gọi API 2
//   setTimeout(() => {
//     const data = { api2: "data" };
//     callback(null, data); // Gọi callback với dữ liệu hoặc lỗi
//   }, 1500); // Giả định API cần 1.5 giây để hoàn thành
// }

// function callAPI3(callback) {
//   // Gọi API 3
//   setTimeout(() => {
//     const data = { api3: "data" };
//     callback(null, data); // Gọi callback với dữ liệu hoặc lỗi
//   }, 2000); // Giả định API cần 2 giây để hoàn thành
// }

// function callAllAPIs(callback) {
//   let results = {};
//   let count = 0;

//   function handleResponse(err, data) {
//     if (err) {
//       callback(err); // Nếu có lỗi, gọi callback với lỗi
//     } else {
//       Object.assign(results, data); // Gộp dữ liệu từ các API thành một đối tượng kết quả
//       count++;

//       if (count === 3) {
//         callback(null, results); // Nếu đã nhận dữ liệu từ cả 3 API, gọi callback với kết quả
//       }
//     }
//   }

//   // Gọi tất cả các API và truyền hàm xử lý kết quả
//   callAPI1(handleResponse);
//   callAPI2(handleResponse);
//   callAPI3(handleResponse);
// }

// // Sử dụng hàm để gọi tất cả các API
// callAllAPIs((err, results) => {
//   if (err) {
//     console.error("Error:", err);
//   } else {
//     console.log("All APIs called successfully with results:", results);
//   }
// });
