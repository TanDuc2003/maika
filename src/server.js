const httpsLocalhost = require("https-localhost");
const pageController = require("./controller/page.controller");
const bodyParser = require("body-parser");
const connectRedis = require("./config/connect.redis");

const { connectDBArango } = require("./config/connect.arango.db");

let app = httpsLocalhost();
app.use(bodyParser.json());
// connectDB();
connectRedis();
connectDBArango();

app.get("/getToken", pageController.getAccessToken);
app.post("/getData", pageController.fetchTicketsFromHTML);
app.get("/getInfo", pageController.getTripInfo);

app.listen();
