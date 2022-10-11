const express = require("express");
const { Survey } = require("../models/schemas.js");

const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    var companyId = req.body.companyId;
    var user = req.body.user;
    var dateObject = req.body.dateObject;
    let survey = await Survey.findOne({
      company_id: companyId,
      "date.year": parseInt(dateObject.year),
      "date.month": parseInt(dateObject.month),
      "date.day": parseInt(dateObject.day),
    }).exec();
    if (!!survey) {
      let newSurvey = survey;
      newSurvey.users.push(user);
      await Survey.updateOne({ _id: survey._id }, newSurvey).exec();
    } else {
      const newSurvey = Survey({
        company_id: companyId,
        date: dateObject,
        users: [user],
      });
      await newSurvey.save();
    }
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

router.post("/removeUser", async (req, res) => {
  try {
    var companyId = req.body.companyId;
    var user = req.body.user;
    var dateObject = req.body.dateObject;
    let survey = await Survey.findOne({
      company_id: companyId,
      "date.year": parseInt(dateObject.year),
      "date.month": parseInt(dateObject.month),
      "date.day": parseInt(dateObject.day),
    }).exec();
    if (!!survey) {
      console.log("ovde", survey);
      let newSurvey = survey;
      newSurvey.users = newSurvey.users.filter((u) => u !== user);
      console.log("newSurvey", newSurvey);
      if (newSurvey.users?.length > 0) {
        await Survey.updateOne({ _id: survey._id }, newSurvey).exec();
      } else {
        await Survey.deleteOne({ _id: survey._id });
      }
    }
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

const getWorkingDaysOfWeekSelectedByDay = (now) => {
  let today = now.getDay();
  let days = [];

  if (today === 6) {
    today = 1;
    now.setDate(now.getDate() + 2);
  } else if (today === 0) {
    today = 1;
    now.setDate(now.getDate() + 1);
  }

  let i = 1;
  while (today - i > 0) {
    var result = new Date(now);
    result.setDate(now.getDate() - today + i);
    days.push({ year: result.getFullYear(), month: result.getMonth() + 1, day: result.getDate() });
    i++;
  }
  i = 0;
  while (today + i < 6) {
    var result = new Date(now);
    result.setDate(now.getDate() + i);
    days.push({ year: result.getFullYear(), month: result.getMonth() + 1, day: result.getDate() });
    i++;
  }
  return days;
};

function getAllDaysInMonth(year, month) {
  const date = new Date(year, month, 1);
  const dates = [];

  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

router.get("/forUserForWeek/:user/:companyId", async (req, res) => {
  try {
    let now = new Date();
    let days = getWorkingDaysOfWeekSelectedByDay(now);

    let orArray = [];
    days.forEach((day) =>
      orArray.push({
        "date.year": parseInt(day.year),
        "date.month": parseInt(day.month),
        "date.day": parseInt(day.day),
      })
    );
    var user = req.params.user;
    var companyId = req.params.companyId;
    let surveys = await Survey.find({
      company_id: companyId,
      $or: orArray,
    }).exec();
    surveys.sort((a, b) => {
      if (a.date.year === b.date.year) {
        if (a.date.month === b.date.month) {
          return a.date.day < b.date.day ? -1 : 1;
        } else {
          return a.date.month < b.date.month ? -1 : 1;
        }
      } else {
        return a.date.year < b.date.year ? -1 : 1;
      }
    });
    userSurveys = [];
    surveys.forEach((survey) => {
      if (survey.users.some((surveyUser) => surveyUser === user)) {
        userSurveys.push(survey);
      }
    });
    return res.send({
      userSurveys: userSurveys,
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.get("/occupancyForWeek/:companyId/:year/:month/:day", async (req, res) => {
  try {
    var year = parseInt(req.params.year);
    var month = parseInt(req.params.month);
    var day = parseInt(req.params.day);

    let now = new Date(year, month - 1, day);
    let days = getWorkingDaysOfWeekSelectedByDay(now);

    let orArray = [];
    days.forEach((day) =>
      orArray.push({
        "date.year": parseInt(day.year),
        "date.month": parseInt(day.month),
        "date.day": parseInt(day.day),
      })
    );

    var companyId = req.params.companyId;
    let surveys = await Survey.find({
      company_id: companyId,
      $or: orArray,
    }).exec();
    surveys.sort((a, b) => {
      if (a.date.year === b.date.year) {
        if (a.date.month === b.date.month) {
          return a.date.day < b.date.day ? -1 : 1;
        } else {
          return a.date.month < b.date.month ? -1 : 1;
        }
      } else {
        return a.date.year < b.date.year ? -1 : 1;
      }
    });
    let statistics = [];
    let j = 0;
    for (let i = 0; i < days.length; i++) {
      if (
        j < surveys.length &&
        surveys.at(j).date.year === days.at(i).year &&
        surveys.at(j).date.month === days.at(i).month &&
        surveys.at(j).date.day === days.at(i).day
      ) {
        statistics.push({
          date: surveys.at(j).date,
          numOfUsers: surveys.at(j)?.users?.length,
          numOfUsersWithoutPlace: surveys.at(j)?.usersWithoutPlace?.length,
        });
        j += 1;
      } else {
        statistics.push({
          date: days.at(i),
          numOfUsers: 0,
          numOfUsersWithoutPlace: 0,
        });
      }
    }
    return res.send({
      statistics: statistics,
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.get("/exists/:email/:companyId/:year/:month/:day", async (req, res) => {
  try {
    var email = req.params.email;
    var companyId = req.params.companyId;
    var year = req.params.year;
    var month = req.params.month;
    var day = req.params.day;
    let survey = await Survey.findOne({
      email: email,
      company_id: companyId,
      "date.year": parseInt(year),
      "date.month": parseInt(month),
      "date.day": parseInt(day),
    }).exec();
    let selectedBefore = true;
    let numOfUsers = 0;
    if (!!survey) {
      selectedBefore = survey?.users.some((surveyUser) => surveyUser === email);
      numOfUsers = survey.users.length;
    } else {
      selectedBefore = false;
    }
    return res.send({
      selectedBefore: selectedBefore,
      numOfUsers: numOfUsers,
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return res.send({
      status: 500,
    });
  }
});

router.post("/addUserWithoutPlace", async (req, res) => {
  try {
    console.log("b");
    var user = req.body.user;
    var companyId = req.body.companyId;
    var dateObject = req.body.dateObject;

    let survey = await Survey.findOne({ company_id: companyId, date: dateObject }).exec();
    if (!!survey) {
      let newSurvey = survey;
      if (!newSurvey?.usersWithoutPlace.some((u) => u === user)) {
        newSurvey.usersWithoutPlace.push(user);
        await Survey.updateOne({ _id: survey._id }, newSurvey).exec();
      }
    }
    console.log("aa");
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

router.get("/forUserForMonth/:user/:companyId/:year/:month", async (req, res) => {
  try {
    var year = parseInt(req.params.year);
    var month = parseInt(req.params.month);
    let days = getAllDaysInMonth(year, month);

    let orArray = [];
    days.forEach((day) => {
      orArray.push({
        "date.year": parseInt(day.getFullYear()),
        "date.month": parseInt(day.getMonth()) + 1,
        "date.day": parseInt(day.getDate()),
      });
    });
    var user = req.params.user;
    var companyId = req.params.companyId;
    let surveys = await Survey.find({
      company_id: companyId,
      $or: orArray,
    }).exec();
    console.log("sur", surveys);
    // userSurveys = [];
    // surveys.forEach((survey) => {
    //   if (survey.users.some((surveyUser) => surveyUser === user)) {
    //     userSurveys.push(survey);
    //   }
    // });
    return res.send({
      userSurveys: surveys,
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
