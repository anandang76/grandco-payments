const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors middleware
const port = 5005;
require("dotenv").config();
const Payment = require("./backend/controller/paymentController");
const { logger } = require("./backend/utils/logger");

app.use(cors({
  origin: '*', // Allow only this origin
  methods: ['GET', 'POST'], // Allow only GET and POST requests
  allowedHeaders: ['Content-Type'], // Allow only specific headers
}));


app.use(express.static("public"));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/openPaymentGateway", Payment.openPaymentGateway);

app.post("/startPaymentTransaction", Payment.startPaymentTransaction);

app.post("/getPaymentTransactionStatus", Payment.getPaymentTransactionStatus);

app.post("/cancelPaymentTransaction", Payment.cancelPaymentTransaction);

app.post("/printReceipt", Payment.printReceipt);

app.post("/linkedRefund", Payment.linkedRefund);

app.get("/getApiInfo", Payment.getApiInfo);

app.listen(port, () => {
  logger.info(`Grandco app listening on port ${port}`);
});
