const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  company_name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  contact_email: {
    type: String,
  },
  contact_number: {
    type: String,
  },
  start_time: {
    type: Object,
    required: true,
  },
  end_time: {
    type: Object,
    required: true,
  },
  admin: {
    type: String,
  },
});

const officeSchema = new mongoose.Schema({
  office_name: {
    type: String,
    required: true,
  },
  company_id: {
    type: String,
    required: true,
  },
  floor: {
    type: Number,
    require: true,
  },
  columns: {
    type: Number,
    required: true,
  },
  rows: {
    type: Number,
    required: true,
  },
  num_of_seats: {
    type: Number,
    required: true,
  },
  matrix: {
    type: [[]],
    required: true,
  },
});

const projectSchema = new mongoose.Schema({
  project_name: {
    type: String,
    required: true,
  },
  company_id: {
    type: String,
    required: true,
  },
  users: {
    type: [],
    required: true,
  },
});

const reservationSchema = new mongoose.Schema({
  company_id: {
    type: String,
    required: true,
  },
  date: {
    type: Object,
    required: true,
  },
  offices: {
    type: {},
    required: true,
  },
});

const surveySchema = new mongoose.Schema({
  company_id: {
    type: String,
    required: true,
    unique: false,
  },
  date: Object,
  users: [],
  usersWithoutPlace: [],
});

const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    required: true,
  },
});

const userCompanySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  company_id: {
    type: String,
    required: true,
  },
  registered: {
    type: Boolean,
    required: true,
  },
});

const Company = mongoose.model("company", companySchema, "company");
const Office = mongoose.model("office", officeSchema, "office");
const Project = mongoose.model("project", projectSchema, "project");
const Survey = mongoose.model("survey", surveySchema, "survey");
const Reservation = mongoose.model("reservation", reservationSchema, "reservation");
const User = mongoose.model("user", userSchema, "user");
const UserCompany = mongoose.model("user_company", userCompanySchema, "user_company");

const mySchemas = {
  Company: Company,
  Project: Project,
  Office: Office,
  Survey: Survey,
  Reservation: Reservation,
  User: User,
  UserCompany: UserCompany,
};
module.exports = mySchemas;
