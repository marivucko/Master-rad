const express = require("express");
const { User } = require("../models/schemas.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newUser = await User.create({
      full_name: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      admin: req.body.admin,
    });
    await newUser.save();
    return res.send({
      status: 200,
      user: newUser,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.get("/find/:email", async (req, res) => {
  try {
    var email = req.params.email;
    const user = await User.findOne({ email: email }).exec();
    console.log("user", user);
    return res.send({
      user: user,
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
