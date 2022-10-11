import "../i18n";
import "./form.css";
import "./../App.css";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="behind-form">
      <div className="form" style={{ marginTop: "20vh", width: "70vh" }}>
        <h1 className="form-page-name">{t("home.welcome")}</h1>
        <h4 className="form-long-text">{t("home.app_description")}</h4>
      </div>
    </div>
  );
};

export default Home;
