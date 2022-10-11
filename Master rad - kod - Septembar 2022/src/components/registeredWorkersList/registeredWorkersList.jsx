import "../../i18n";
import "./../../App.css";
import "./registeredWorkersList.css";
import { useTranslation } from "react-i18next";
import React, { useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { GlobalContext } from "../../context/globalContext.js";

const RegisteredWorkersList = ({ registredUsers, simpleList = false }) => {
  const { t } = useTranslation();
  const { getUserProject, getUserName, user } = useContext(GlobalContext);
  return (
    <div className={simpleList ? "reg-wrks-list-5" : "reg-wrks-list"}>
      {registredUsers?.map((registredUser) => {
        return (
          <div
            className={
              simpleList
                ? registredUser === user?.email
                  ? "reg-wrks-row colored"
                  : "reg-wrks-row"
                : "reg-wrks-row"
            }
            key={registredUser.email}
          >
            <div key={simpleList ? registredUser : registredUser["_id"]}>
              <div className="reg-wrks-full-name">
                {simpleList ? getUserName(registredUser) : getUserName(registredUser.email)}
              </div>
              <div className="reg-wrks-email"> {simpleList ? registredUser : registredUser.email}</div>
            </div>
            <div>
              <span className="reg-wrks-project-label">{t("admin.workers.main_page.project")} </span>
              <span className="reg-wrks-project-name">
                {simpleList ? getUserProject(registredUser) : getUserProject(registredUser.email)}
              </span>
            </div>
          </div>
        );
      })}
      {registredUsers?.length === 0 && <h4>{t("admin.workers.main_page.no_reg_workers")}</h4>}
    </div>
  );
};

export default RegisteredWorkersList;
