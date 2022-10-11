const express = require("express");
const { Company, Reservation, Survey, UserCompany, Project, Office } = require("../models/schemas.js");
const ObjectId = require("mongodb").ObjectId;

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newCompany = await Company.create({
      company_name: req.body.company_name,
      address: req.body.address,
      contact_email: req.body.contact_email,
      contact_number: req.body.contact_number,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      admin: req.body.admin,
    });
    await newCompany.save();
    console.log("newCompany", newCompany);
    return res.send({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.put("/", async (req, res) => {
  try {
    const companyToUpdate = Company({
      _id: req.body._id,
      company_name: req.body.company_name,
      address: req.body.address,
      contact_email: req.body.contact_email,
      contact_number: req.body.contact_number,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      admin: req.body.admin,
    });
    await Company.findOneAndUpdate({ _id: req.body._id }, companyToUpdate).exec();
    console.log("Updated company", companyToUpdate);
    return res.send({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Reservation.deleteMany({ company_id: req.params.id });
    await Project.deleteMany({ company_id: req.params.id });
    await Survey.deleteMany({ company_id: req.params.id });
    await Office.deleteMany({ company_id: req.params.id });
    await UserCompany.deleteMany({ company_id: req.params.id });
    result = await Company.deleteOne({ _id: req.params.id });
    return res.send({
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.get("/admin/:admin", async (req, res) => {
  try {
    var admin = req.params.admin;
    let companies = await Company.find({ admin: admin }).exec();
    console.log("Companies", companies);
    return res.send({
      status: 200,
      companies: companies,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

module.exports = router;
