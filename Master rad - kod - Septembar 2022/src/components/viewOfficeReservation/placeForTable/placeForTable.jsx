import React, { useContext } from "react";
import "./placeForTable.css";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../../../context/globalContext.js";

const PlaceForTable = ({ field }) => {
  const { t } = useTranslation();
  const { user, getUserProject, getUserName } = useContext(GlobalContext);

  return (
    <div
      style={{
        height: "100px",
        width: "100px",
      }}
    >
      <div
        className={
          field.orientation === -1 || (field.orientation > -1 && field.user === "")
            ? "container-view-empty"
            : "container-view"
        }
        style={{
          border: user?.email === field.user ? "5px solid rgb(46, 83, 110)" : " 0.5px solid lightgrey",
        }}
      >
        <div className={field.orientation === 1.5 ? "label-text-top-right" : "label-text-top-left"}>
          {field.label}
        </div>
        <div
          className={
            field.orientation === -1
              ? `empty`
              : field.user !== ""
              ? `table deg` + String(field.orientation * 90) + `taken`
              : `table deg` + String(field.orientation * 90)
          }
        >
          {field.user !== "" && (
            <div className="more-info">
              {field.label !== "" && (
                <div>
                  <span className="smaller-text ">{t("view_office.label")}</span>
                  <span> {field.label}</span>
                  <br />
                </div>
              )}
              <div>
                <span className="smaller-text ">{t("view_office.full_name")}</span>
                <span> {getUserName(field.user)}</span>
              </div>
              <div>
                <span className="smaller-text ">{t("view_office.email")}</span>
                <span> {field.user}</span>
              </div>

              <br />
              <div>
                <span className="smaller-text ">{t("view_office.project")}</span>
                <span> {getUserProject(field.user)}</span>
              </div>
            </div>
          )}
          <div className="gray-shadow">
            <div className="user-text">{field.user}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceForTable;
