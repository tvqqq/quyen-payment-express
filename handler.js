require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const app = express();

// api json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// mongoose connect
// const mongoose = require("./config/mongoose");
// mongoose.connect();

// cors
const cors = require("cors");
app.use(cors());

// lodash
const _ = require("lodash");
global._ = _;

// routes
const routes = require("./routes");
app.use("/api", routes);

const slsHandler = serverless(app);

const slsCronHandler = async (event, context) => {
  console.log("slsCronHandler", slsCronHandler);
  event.path = "/api/tcb/refresh";
  // TODO: here
  event.query = JSON.stringify({
    bypass: process.env.TOKEN_BYPASS_REFRESH,
  });
  const result = await slsHandler(event, context);
  console.log("result", result);
  return result;
};

module.exports = {
  serverless: slsHandler,
  cron: slsCronHandler,
  default: app,
};
