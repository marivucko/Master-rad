import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import FormInput from "../../../components/input/formInput/formInput.jsx";
import { useState } from "react";
import "../../form.css";
import "./../../../App.css";
import { addCompany } from "../../../serverCommunicatoin/companyCommunication.js";
import TimePicker from "../../../components/timePicker/timePicker";
import { toast } from "react-toastify";
import { GlobalContext } from "../../../context/globalContext.js";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const AdminAddCompany = () => {
  const { t } = useTranslation();
  const { user, setIsLoading } = useContext(GlobalContext);
  let navigate = useNavigate();

  const [startTime, setStartTime] = useState({
    hour: 7,
    minute: 0,
  });
  const [endTime, setEndTime] = useState({
    hour: 19,
    minute: 0,
  });

  const onChangeStartTime = (time) => {
    setStartTime(time);
    if (time.hour > endTime.hour || (time.hour === endTime.hour && time.minute >= endTime.minute)) {
      setEndTime(time);
    }
  };
  const onChangeEndTime = (time) => {
    setEndTime(time);
    if (time.hour < startTime.hour || (time.hour === startTime.hour && time.minute <= startTime.minute)) {
      setStartTime(time);
    }
  };

  const [values, setValues] = useState({
    company_name: "",
    address: "",
    contact_email: "",
    contact_number: "",
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const inputs = [
    {
      icon: "bi bi-building form-input-icon",
      id: "company_name",
      name: "company_name",
      type: "text",
      placeholder: t("admin.add_company.company_name"),
      require: true,
      errorMessage: t("admin.add_company.error_empty_field"),
    },
    {
      icon: "bi bi-geo-alt form-input-icon",
      id: "address",
      name: "address",
      type: "text",
      placeholder: t("admin.add_company.address"),
      require: true,
      errorMessage: t("admin.add_company.error_empty_field"),
    },
    {
      icon: "bi bi-envelope form-input-icon",
      id: "contact_email",
      name: "contact_email",
      type: "email",
      placeholder: t("admin.add_company.contact_email"),
      require: true,
      errorMessage: t("admin.add_company.email_not_valid_format"),
    },
    {
      icon: "bi bi-telephone form-input-icon",
      id: "contact_number",
      name: "contact_number",
      type: "text",
      placeholder: t("admin.add_company.contact_number"),
      require: true,
      errorMessage: t("admin.add_company.error_empty_field"),
    },
  ];

  return (
    <div className="behind-form">
      <form
        className="form"
        style={{ padding: "2rem 5rem" }}
        onSubmit={async (e) => {
          e.preventDefault();
          let response = await addCompany(
            {
              ...values,
              admin: user?.email,
              start_time: startTime,
              end_time: endTime,
            },
            setIsLoading,
            t,
            t("admin.add_company.success")
          );
          if (response.status === 200) {
            setTimeout(() => {
              navigate("/adminHomePage");
            }, 1000);
          }
        }}
      >
        <h1 className="form-page-name">{t("admin.add_company.form_title")}</h1>
        {inputs.map((input) => (
          <FormInput key={input.id} {...input} value={values[input.name]} onChange={onChange} />
        ))}
        <div className="form-text-and-input">
          <span className="form_text_before_input">{t("admin.add_company.start_of_working_hours")}</span>
          <TimePicker time={startTime} onChange={onChangeStartTime} style={"style_form"} />
        </div>
        <br />
        <div className="form-text-and-input">
          <span className="form_text_before_input">{t("admin.add_company.end_of_working_hours")}</span>
          <TimePicker
            time={endTime}
            onChange={onChangeEndTime}
            startTime={{ hour: startTime.hour, minute: startTime.minute }}
            endTime={{ hour: 24, minute: 0 }}
            includeStartTime={false}
            includeEndTime={false}
            style={"style_form"}
          />
        </div>
        <button className="form-button" type="submit">
          {t("admin.add_company.submit")}
        </button>
      </form>
    </div>
  );
};

export default AdminAddCompany;
