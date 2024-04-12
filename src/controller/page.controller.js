const pageServices = require("../services//page.services");
const cheerio = require("cheerio");
const DBServices = require("../services/db.services");
const dbServices = new DBServices();

//singleton
let getAccessToken = async (req, res) => {
  try {
    const response = await pageServices.getToken();
    return res.status(200).json(response);
  } catch (error) {
    console.log("error", error);
  }
};

let fetchTicketsFromHTML = async (req, res) => {
  const { html_url, access_token } = req.body;
  if (!html_url || !access_token)
    return res.status(400).json({ error: "html_url or access_token required" });

  try {
    const response = await fetch(html_url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const tickets = [];

    $('[id^="ticket-"]').each((__, element) => {
      const ticket = $(element).attr("id");
      const companyName = $(element).attr("data-company-name");
      const ticketSplit = ticket.split("-");
      const ticketId = ticketSplit[ticketSplit.length - 1];
      tickets.push({ id: ticketId, companyName: companyName });
    });

    if (tickets.length == 0)
      return res.status(200).json({ message: "Tickets are empty" });

    const responses = await Promise.allSettled(
      tickets.map((item) => getDataVexere(item.id, access_token))
    );

    const data = responses
      .filter((res) => res.status === "fulfilled")
      .map((item) => item.value);

    return res.status(200).json(data);
  } catch (error) {
    console.error("error fetchTicketsFromHTML", error);
    res.status(500).json(error);
  }
};

async function getDataVexere(ticket_id, access_token) {
  const apiUrl = `https://api.vexere.com/v3/trip/${ticket_id}?from=29&to=2&config=ONLINE`;
  try {
    const response = await pageServices.fetchTripConfig(apiUrl, access_token);
    if (response) {
      await dbServices.createData(response, ticket_id);
    }
    return response;
  } catch (error) {
    console.error("Error Config GetDataVexere API:", error);
  }
}

module.exports = { fetchTicketsFromHTML, getAccessToken };
