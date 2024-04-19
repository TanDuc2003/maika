const pageServices = require("../services/page.services");
const cheerio = require("cheerio");
const DBServices = require("../services/db.services");
const dbServices = new DBServices();
const connectToRedis = require("../config/connect.redis");
const html_urls = require("../public/html_urls");

const getAccessToken = async (req, res) => {
  try {
    const response = await pageServices.getToken();
    const redis = await connectToRedis();
    console.log("Redis", redis);
    if (redis) {
      await redis.set("access_token", response.access_token);
    }
    return res.status(200).json({ access_token: response.access_token });
  } catch (error) {
    console.log("error", error);
  }
};

const fetchTicketsFromHTML = async (req, res) => {
  const redis = await connectToRedis();
  const { date } = req.body;
  console.log(date);
  const access_token = await redis.get("access_token");
  if (!date || !access_token)
    return res.status(400).json({ error: "date or access_token required" });
  try {
    console.time();
    const tickets = [];
    const responses = [];
    for (const html_url of html_urls) {
      const { route_name, route_code } = extractInfo(html_url);
      const url = `${html_url}${date}&v=4`;
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      $('[id^="ticket-"]').each((__, element) => {
        const ticket = $(element).attr("id");
        const companyName = $(element).attr("data-company-name");
        const ticketSplit = ticket.split("-");
        const ticketId = ticketSplit[ticketSplit.length - 1];
        tickets.push({ id: ticketId, companyName: companyName });
      });

      if (tickets.length == 0) {
        responses.push({ status: "Tickets are empty" });
      } else {
        const params = { access_token, route_name, route_code, date };
        Promise.allSettled(
          tickets.map((item) => getDataVexere(item.id, params))
        );
        console.log("success html", url);
      }
    }
    console.timeEnd();
    return res.status(200).json({ mesage: "add data success" });
  } catch (error) {
    console.error("error fetchTicketsFromHTML", error);
    res.status(500).json(error);
  }
};

async function getDataVexere(ticket_id, params) {
  const { access_token, route_name, route_code, date } = params;
  const apiUrl = `https://api.vexere.com/v3/trip/${ticket_id}?config=ONLINE`;
  try {
    const response = await pageServices.fetchTripConfig(apiUrl, access_token);
    if (response) {
      const newDataPost = {
        route_name,
        route_code,
        vehicle_quality: response.route?.vehicle_quality,
        vehicle_seat_type: response.route?.vehicle_seat_type,
        departure_time: converISO(date, response.route?.departure.time),
        arrival_time: converISO(date, response.route?.destination.time),
        date: date,
        response,
      };
      await dbServices.createData(newDataPost, ticket_id);
    }
    return response;
  } catch (error) {
    console.error("Error Config GetDataVexere API:", error);
  }
}

const getTripInfo = async (req, res) => {
  const redis = await connectToRedis();
  const access_token = await redis.get("access_token");

  if (!access_token)
    return res
      .status(400)
      .json({ error: "html_urls or access_token required" });
  try {
    console.time();
    for (const html_url of html_urls) {
      const url = `${html_url}16-04-2024&v=4`;
      const { route_name, route_code } = extractInfo(url);
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);
      const faqData = [];
      $('[id^="seo-faq"]')
        .find("div.ant-collapse-item")
        .each((__, element) => {
          const question = $(element)
            .find(".ant-collapse-header p")
            .text()
            .trim();
          const answer = $(element)
            .find(".ant-collapse-content p[itemprop='text']")
            .text()
            .trim();
          faqData.push({ question, answer });
        });

      const title = $("#seo-info-trip .title").text().trim();
      let data = $(".groups-route-info .item")
        .map((_, element) => {
          const label = $(element).find(".label").text().trim();
          const value = $(element).find(".value").text().trim();
          const data = `${label} ${value}`;
          return data;
        })
        .get();
      let dataContent = [];
      $(".content-dynamic").each((i, element) => {
        if (i === 0) return;
        if (i === 1) {
          const title = $(element).find(".title-dynamic h3").text().trim();
          const content = $(element).find(".content").text().trim();
          dataContent.push({ title, content });
        }
        if (i === 2) {
          const title = $(element).find(".title-dynamic h3").text().trim();
          const content = $(element).find(".content").text().trim();
          dataContent.push({ title, content });
        }
        if (i === 3) {
          return;
        }
        if (i === 4 || i === 5 || i === 6) {
          const title = $(element).find(".title-dynamic h4").text().trim();
          const content = $(element).find(".content").text().trim();
          dataContent.push({ title, content });
        }
        if (i === 7) {
          const title = $(element).find(".title-dynamic h3").text().trim();
          const content = $(element).find(".content").text().trim();
          dataContent.push({ title, content });
        }
        if (i === 8) {
          const title = $(element).find(".title").text().trim();
          const content = $(element).find(".content").text().trim();
          dataContent.push({ title, content });
        }
        return;
      });

      const datapost = {
        html_url,
        route_name,
        route_code,
        faqData,
        route_info: {
          title: title,
          route_leng: data[0],
          travel_time: data[1],
          ticket_price: data[2],
          number_trip: data[3],
          number_garage: data[4],
        },
        info_trip: dataContent,
      };
      await dbServices.createDataInfoTrip(datapost, route_name);
    }
    console.timeEnd();
    return res.status(200).json({ mesage: "add data infotrip success" });
  } catch (error) {
    console.error("error fetchTicketsFromHTML", error);
    res.status(500).json(error);
  }
};

function converISO(currentDate, dateTime) {
  const isoDateTime = `${currentDate}T${dateTime}:00+07:00`;
  return isoDateTime;
}

function extractInfo(html_url) {
  const urlObj = new URL(html_url);
  const pathSegments = urlObj.pathname.split("/");
  const name = pathSegments[pathSegments.length - 1].replace(".html", "");
  const route_code = name.split("-").pop();
  const route_name = name.replace(`-${route_code}`, "");
  return { route_name, route_code };
}

module.exports = {
  fetchTicketsFromHTML,
  getAccessToken,
  getTripInfo,
};
