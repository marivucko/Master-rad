import React, { useState, useEffect } from "react";
import ManageOffice from "./manageOffice";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../../../context/globalContext.js";
import FormInput from "../../../components/input/formInput/formInput.jsx";

const AdminUpdateOffice = () => {
  const max = 75;
  const { t } = useTranslation();

  const { selectedCompanyId, selectedOffice } = useContext(GlobalContext);

  const [values, setValues] = useState({
    office_name: selectedOffice?.office_name,
    floor: selectedOffice?.floor,
    columns: selectedOffice?.columns,
    rows: selectedOffice?.rows,
  });

  const onChange = (e) => {
    if (e.target.name === "office_name" || e.target.name === "floor") {
      setValues({ ...values, [e.target.name]: e.target.value });
    } else if (e.target.value > 0) {
      if (e.target.value > max) {
        setValues({ ...values, [e.target.name]: max });
      } else {
        setValues({ ...values, [e.target.name]: e.target.value });
      }
    } else {
      setValues({ ...values, [e.target.name]: 1 });
    }
  };

  const inputs = [
    {
      icon: "bi bi-textarea-t form-input-icon",
      id: "office_name",
      name: "office_name",
      type: "text",
      placeholder: t("admin.add_office.office_name"),
      require: true,
      errorMessage: t("admin.update_office.error_empty_field"),
    },
    {
      icon: "bi bi-arrow-up form-input-icon",
      id: "floor",
      name: "floor",
      type: "number",
      placeholder: t("admin.add_office.office_floor"),
      require: true,
      errorMessage: t("admin.update_office.error_empty_field"),
    },
    {
      icon: "bi bi-three-dots form-input-icon",
      id: "columns",
      name: "columns",
      type: "number",
      placeholder: t("admin.add_office.office_columns"),
      require: true,
      pattern: "[0-9]+",
      errorMessage: t("admin.update_office.error_empty_field"),
      min: 1,
      max: max,
    },
    {
      icon: "bi bi-three-dots-vertical form-input-icon",
      id: "rows",
      name: "rows",
      type: "number",
      placeholder: t("admin.add_office.office_rows"),
      require: true,
      pattern: "[0-9]+",
      errorMessage: t("admin.update_office.error_empty_field"),
      min: 1,
      max: max,
    },
  ];

  return (
    <div className="behind-form">
      <div className="form" style={{ padding: "1rem 5rem", backgroundColor: "white" }}>
        <h1 className="form-page-name">{t("admin.update_office.form_title")}</h1>
        <div className="row-container">
          {inputs.map((input) => (
            <FormInput
              key={input.id}
              {...input}
              value={values[input.id]}
              onChange={onChange}
              className="form-office-input-with-icon"
            />
          ))}
        </div>
        <div className="container">
          <ManageOffice
            officeName={values["office_name"]}
            floor={values["floor"]}
            numOfColumns={values["columns"]}
            numOfRows={values["rows"]}
            selectedOffice={selectedOffice}
            selectedCompanyId={selectedCompanyId}
            matrix={selectedOffice?.matrix}
            showSaveOrUpdate={2}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminUpdateOffice;
