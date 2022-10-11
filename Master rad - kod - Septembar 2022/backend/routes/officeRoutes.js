const express = require("express");
const { Office } = require("../models/schemas.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newOffice = await Office.create({
      office_name: req.body.office_name,
      company_id: req.body.company_id,
      floor: req.body.floor,
      columns: req.body.columns,
      rows: req.body.rows,
      num_of_seats: req.body.num_of_seats,
      matrix: req.body.matrix,
    });
    await newOffice.save();
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
    const officeToUpdate = Office({
      _id: req.body._id,
      office_name: req.body.office_name,
      company_id: req.body.company_id,
      floor: req.body.floor,
      columns: req.body.columns,
      rows: req.body.rows,
      num_of_seats: req.body.num_of_seats,
      matrix: req.body.matrix,
    });
    await Office.findOneAndUpdate({ _id: req.body._id }, officeToUpdate).exec();
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
  console.log("---", req.params.id);
  try {
    result = await Office.deleteOne({ _id: req.params.id });
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

router.get("/fromCompany/:companyId", async (req, res) => {
  try {
    var companyId = req.params.companyId;
    let offices = await Office.find({ company_id: companyId }).exec();
    console.log("Offices", offices);
    return res.send({
      offices: offices,
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
