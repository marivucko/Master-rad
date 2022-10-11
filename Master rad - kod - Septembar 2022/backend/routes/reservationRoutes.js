const e = require("express");
const express = require("express");
const { Reservation } = require("../models/schemas.js");

const router = express.Router();

router.get("/fromCompany/:companyId", async (req, res) => {
  try {
    var companyId = req.params.companyId;
    let reservations = await Reservation.find({ company_id: companyId }).exec();
    console.log("reservations", reservations);
    return res.send({
      status: 200,
      reservations: reservations,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.get("/fromCompanyForDate/:companyId/:year/:month/:day", async (req, res) => {
  try {
    now = new Date();
    var companyId = req.params.companyId;
    let reservation = await Reservation.findOne({
      company_id: companyId,
      "date.year": parseInt(req.params.year),
      "date.month": parseInt(req.params.month),
      "date.day": parseInt(req.params.day),
    }).exec();
    return res.send({
      reservation: reservation,
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

module.exports = router;
