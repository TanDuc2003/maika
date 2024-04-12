const fetch = require("node-fetch");
const cheerio = require("cheerio");

async function fetchTicketsFromHTML(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const tickets = [];
    $('[id^="ticket-"]').each((index, element) => {
      const ticket = $(element).attr("id");
      const companyName = $(element).attr("data-company-name");
      const ticketSplit = ticket.split("-");
      const ticketId = ticketSplit[ticketSplit.length - 1];
      tickets.push({
        id: ticketId,
        companyName: companyName,
      });
    });
    return tickets;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ HTML:", error);
    throw error;
  }
}

const url =
  "https://vexere.com/vi-VN/ve-xe-khach-tu-sai-gon-di-ba-ria-vung-tau-viet-nam-129t121.html?date=24-05-2024&v=4";
fetchTicketsFromHTML(url)
  .then((tickets) => {
    console.log("Các tickets:", tickets);
  })
  .catch((error) => {
    console.log("Lỗi khi lấy dữ liệu từ HTML:", error);
  });
