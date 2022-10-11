var cron = require("node-cron");
callAlgorithm = require("./algorithm/algorithm.js");

const express = require("express");
const bodyParser = require("body-parser");

const companyRouterHandler = require("./routes/companyRoutes.js");
const officeRouterHandler = require("./routes/officeRoutes.js");
const projectRouterHandler = require("./routes/projectRoutes.js");
const reservationRoutesHandler = require("./routes/reservationRoutes.js");
const surveyRoutesHandler = require("./routes/surveyRoutes.js");
const userRoutesHandler = require("./routes/userRoutes.js");
const userCompanyRoutesHandler = require("./routes/userCompanyRoutes.js");

const COMPANY_SUFFIX = "/company";
const OFFICE_SUFFIX = "/office";
const PROJECT_SUFFIX = "/project";
const RESERVATION_SUFFIX = "/reservation";
const SURVEY_SUFFIX = "/survey";
const USER_SUFFIX = "/user";
const USER_COMPANY_SUFFIX = "/userCompany";

const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(COMPANY_SUFFIX, companyRouterHandler);
app.use(OFFICE_SUFFIX, officeRouterHandler);
app.use(PROJECT_SUFFIX, projectRouterHandler);
app.use(RESERVATION_SUFFIX, reservationRoutesHandler);
app.use(SURVEY_SUFFIX, surveyRoutesHandler);
app.use(USER_SUFFIX, userRoutesHandler);
app.use(USER_COMPANY_SUFFIX, userCompanyRoutesHandler);

// DB Connection
mongoose
  .connect(process.env.DATABASE_ACCESS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected!");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 4000; // backend routing port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// cron.schedule("*/1 18 * * *", async () => {
cron.schedule("0 20 * * *", async () => {
  console.log("running a task every day", new Date().getMinutes());
  callAlgorithm();
});
