const express = require("express");
const { Project } = require("../models/schemas.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const newProject = await Project.create({
      project_name: req.body.project_name,
      company_id: req.body.company_id,
      users: req.body.users,
    });
    await newProject.save();
    console.log("newProject", newProject);
    return res.send({
      project: newProject,
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
    const updateProject = Project({
      _id: req.body.project._id,
      project_name: req.body.project.project_name,
      company_id: req.body.project.company_id,
      users: req.body.users,
    });
    console.log(updateProject);
    await Project.findOneAndUpdate({ _id: req.body.project._id }, updateProject).exec();
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
    result = await Project.deleteOne({ _id: req.params.id });
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

router.get("/getAll/:companyId", async (req, res) => {
  try {
    var companyId = req.params.companyId;
    let projects = await Project.find({ company_id: companyId }).exec();
    return res.send({
      projects: projects,
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
