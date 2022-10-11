import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../../../context/globalContext.js";
import { useNavigate } from "react-router-dom";
import { getOfficiesFromComapny } from "../../../serverCommunicatoin/officeCommunication.js";
import { toast } from "react-toastify";

const AdminOffices = ({}) => {
  const { t } = useTranslation();
  let navigate = useNavigate();

  const { setIsLoading, selectedCompany, setSelectedOffice, setOffices } = useContext(GlobalContext);
  const [officesMatrix, setOfficesMatrix] = useState([]);

  useEffect(() => {
    async function getOffices() {
      const result = await getOfficiesFromComapny(selectedCompany["_id"], setIsLoading, t);
      let fetchedOffices;
      if (result.status === 200) {
        fetchedOffices = result.offices;
        setOffices(fetchedOffices);
      } else {
        toast.error(t("admin.add_company.error_loading_offices"));
        return;
      }
      if (fetchedOffices.length === 0) {
        setOfficesMatrix([]);
      } else {
        fetchedOffices.sort((a, b) => {
          return a.floor < b.floor ? -1 : 1;
        });
        let officesMatrixCurr = [];
        let floors = [fetchedOffices.at(0).floor];
        let officesRow = [fetchedOffices.at(0)];
        let floor = fetchedOffices.at(0).floor;
        fetchedOffices.forEach((e, index) => {
          if (index >= 1) {
            if (floors.includes(e.floor)) {
              officesRow.push(e);
            } else {
              officesMatrixCurr.push({ floor: floor, officesRows: officesRow });
              officesRow = [e];
              floor = e.floor;
              floors.push(e.floor);
            }
          }
        });
        officesMatrixCurr.push({ floor: floor, officesRows: officesRow });
        setOfficesMatrix(officesMatrixCurr);
      }
    }
    getOffices();
  }, [selectedCompany]);

  return (
    <div className="behind-form">
      <div className="form" style={{ marginTop: "10vh", width: "70vh" }}>
        <h1 className="form-page-name"> {t("admin.offices.form_title")}</h1>
        <div className="column-container">
          <div className="main-content">
            {officesMatrix.map((row, i) => (
              <div key={i} className="row-container-office">
                <div className="row-container-floor-title">
                  {row.floor}. {t("admin.offices.floor")}
                </div>
                {row.officesRows.map((col, j) => (
                  <div key={i * row.officesRows.length + j}>
                    <div
                      className="form-office-card"
                      onClick={() => {
                        setSelectedOffice(col);
                        navigate("/adminOfficeDetails");
                      }}
                    >
                      {col.office_name}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {officesMatrix.length === 0 && (
            <div style={{ margin: "1.5rem", fontSize: "1.25rem" }}> {t("admin.offices.no_offices")}</div>
          )}
          <br />
          <button
            className="bi bi-plus-circle-dotted form-button-smaller-padding"
            onClick={() => navigate("/adminAddOffice")}
          >
            &nbsp;&nbsp;{t("admin.offices.add_office_button")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOffices;
