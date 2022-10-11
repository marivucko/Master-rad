const express = require("express");
const { UserCompany, Company, User } = require("../models/schemas.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    var email = req.body.email;
    var companyId = req.body.company_id;
    const user = await User.findOne({ email: email }).exec();
    if (!!user) {
      const newUserCompany = await UserCompany.create({
        email: email,
        company_id: companyId,
        registered: true,
      });
      await newUserCompany.save();
      console.log("new userCompany added!");
      return res.send({
        status: 200,
      });
    } else {
      const newUserCompany = await UserCompany.create({
        email: email,
        company_id: companyId,
        registered: false,
      });
      await newUserCompany.save();
      console.log("new userCompany created!");
      return res.send({
        status: 200,
      });
    }
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.get("/userCompanyExist/:email/:companyId", async (req, res) => {
  try {
    var email = req.params.email;
    var companyId = req.params.companyId;
    const userCompany = await UserCompany.findOne({ email: email, company_id: companyId }).exec();
    console.log("userCompany", userCompany);
    return res.send({ status: 200, userCompany: userCompany });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.get("/userCompanies/:email", async (req, res) => {
  try {
    var email = req.params.email;
    let userCompanies = await UserCompany.find({ email: email }).exec();
    let companies = await Company.find()
      .where("_id")
      .in(
        userCompanies.map(function (userCompany) {
          return userCompany.company_id;
        })
      )
      .exec();
    return res.send({ status: 200, companies: companies });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.get("/registeredUserCompany/:companyId", async (req, res) => {
  try {
    var companyId = req.params.companyId;
    let userCompanies = await UserCompany.find({ company_id: companyId, registered: true }).exec();
    console.log("userCompanies", userCompanies);
    return res.send({
      status: 200,
      userCompanies: userCompanies,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.get("/registeredUserNamesCompany/:companyId", async (req, res) => {
  try {
    var companyId = req.params.companyId;
    let usersNames = [];
    const userCompanyArray = await UserCompany.find({ company_id: companyId }).exec();
    for (const elem of userCompanyArray) {
      const user = await User.findOne({ email: elem.email }).exec();
      if (!!user) {
        usersNames.push({ email: user.email, full_name: user.full_name });
      }
    }
    return res.send({
      usersNames: usersNames,
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.get("/invitedUserCompany/:companyId", async (req, res) => {
  try {
    var companyId = req.params.companyId;
    let userCompanies = await UserCompany.find({ company_id: companyId, registered: false }).exec();
    console.log("userCompanies1", userCompanies);
    return res.send({
      status: 200,
      userCompanies: userCompanies,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.put("/setRegistered", async (req, res) => {
  try {
    var email = req.body.email;
    let userCompanies = await UserCompany.find({ email: email }).exec();
    for (let userCompany of userCompanies) {
      if (!userCompany.registered) {
        userCompany.registered = true;
        await UserCompany.findOneAndUpdate({ _id: userCompany._id }, userCompany).exec();
      }
    }
    return res.send({ status: 200 });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

module.exports = router;
