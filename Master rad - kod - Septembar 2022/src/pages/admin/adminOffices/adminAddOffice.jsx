import React, { useState } from "react";
import ManageOffice from "./manageOffice";
import { useTranslation } from "react-i18next";
import FormInput from "../../../components/input/formInput/formInput.jsx";
import { GlobalContext } from "../../../context/globalContext.js";
import { useContext } from "react";

const AdminAddOffice = () => {
  const max = 75;
  const { t } = useTranslation();
  const { setIsLoading, selectedCompanyId } = useContext(GlobalContext);

  const [values, setValues] = useState({
    office_name: "",
    floor: "",
    columns: "",
    rows: "",
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
      errorMessage: t("admin.add_office.office_name_error"),
    },
    {
      icon: "bi bi-arrow-up form-input-icon",
      id: "floor",
      name: "floor",
      type: "number",
      placeholder: t("admin.add_office.office_floor"),
      require: true,
      errorMessage: t("admin.add_office.floor_error"),
    },
    {
      icon: "bi bi-three-dots form-input-icon",
      id: "columns",
      name: "columns",
      type: "number",
      placeholder: t("admin.add_office.office_columns"),
      require: true,
      pattern: "[0-9]+",
      errorMessage: t("admin.add_office.error"),
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
      errorMessage: t("admin.add_office.error"),
      min: 1,
      max: max,
    },
  ];

  return (
    <div className="behind-form">
      <div className="form" style={{ padding: "1rem 5rem", backgroundColor: "white" }}>
        <h1 className="form-page-name">{t("admin.add_office.form_title")}</h1>
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
        {values["columns"] > 0 && values["rows"] > 0 && (
          <div className="container">
            <ManageOffice
              officeName={values["office_name"]}
              floor={values["floor"]}
              numOfColumns={values["columns"]}
              numOfRows={values["rows"]}
              selectedOffice={null}
              selectedCompanyId={selectedCompanyId}
              matrix={null}
              showSaveOrUpdate={1}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAddOffice;
