const httpsLocalhost = require("https-localhost");
const connectDB = require("./config/connect.db");
const pageController = require("./controller/page.controller");
const bodyParser = require("body-parser");
const { connectDBArango } = require("./config/connect.arango.db");

let app = httpsLocalhost();
app.use(bodyParser.json());
// connectDB();

connectDBArango();

app.get("/getData", pageController.fetchTicketsFromHTML);

app.listen();
