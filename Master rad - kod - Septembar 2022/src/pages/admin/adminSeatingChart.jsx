import "../../i18n";
import "./../form.css";
import "./../../App.css";
import { useTranslation } from "react-i18next";
import React, { useState, useContext, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { GlobalContext } from "../../context/globalContext.js";
import DatePicker from "../../components/datePicker/datePicker";
import { fromDateToObjectYMD, setToMondayIfWeekendSelected } from "../../utils/timeDateHelpter";
import { getReservations, setMatrixOfOffices } from "../../utils/pageHelper";
import ViewOffice from "../../components/viewOfficeReservation/viewOffice/viewOffice";
import RegisteredWorkersList from "../../components/registeredWorkersList/registeredWorkersList";

const AdminSeatingChart = () => {
  const { t } = useTranslation();
  const { setIsLoading, selectedCompany, countryLocale, offices, setUsersNames, usersNames } =
    useContext(GlobalContext);

  let now = new Date();
  const [dateObject, setDateObject] = useState(setToMondayIfWeekendSelected(fromDateToObjectYMD(now)));
  const [officesMatrix, setOfficesMatrix] = useState([]);
  const [selectedOfficeReservation, setSelectedOfficeReservation] = useState(null);
  const [selectedResOff, setSelectedResOff] = useState([]);

  console.log({ selectedOfficeReservation });
  console.log({ selectedResOff });

  useEffect(() => {
    getReservations(
      selectedCompany,
      dateObject,
      setSelectedOfficeReservation,
      setSelectedResOff,
      setIsLoading,
      offices,
      t
    );
  }, [dateObject]);

  useEffect(() => {
    setMatrixOfOffices(selectedCompany, setOfficesMatrix, setIsLoading, t);
    // getUsers();
  }, []);

  return (
    <div className="behind-form" style={{ flexDirection: "column", alignItems: "center" }}>
      <div>
        <div>
          <div className="form" style={{ position: "absolute", top: "0", left: "2rem" }}>
            <div className="row-container">
              <h1 className="form-page-name">{t("admin.seating_chart.form_title")}</h1>
              <DatePicker
                dateObject={dateObject}
                setDateObject={setDateObject}
                label={t("admin.seating_chart.select_date")}
                locale={countryLocale.locale}
              />
            </div>
            {selectedOfficeReservation === null && (
              <h2 className="form-long-text" style={{ color: "red" }}>
                {t("admin.seating_chart.no_seating_chart_for_this_date")}
              </h2>
            )}
          </div>

          <div className="form" style={{ position: "absolute", top: "0", right: "2rem" }}>
            <div>
              {officesMatrix?.length > 0 ? (
                <div className="main-content">
                  <div
                    className="row-container-floor-title column-container"
                    style={{ marginBottom: "1rem" }}
                  >
                    {t("admin.seating_chart.select_office")}
                  </div>
                  {officesMatrix?.map((row, i) => (
                    <div key={i} className="row-container-office">
                      <div className="row-container-floor-title">
                        {row.floor}. {t("admin.offices.floor")}
                      </div>
                      {row.officesRows.map((col, j) => (
                        <div key={i * row.officesRows.length + j}>
                          <div
                            className={
                              selectedResOff?.office?.["_id"] === col["_id"]
                                ? "form-office-card-reverse-color"
                                : "form-office-card"
                            }
                            onClick={() => {
                              selectedOfficeReservation?.offices?.forEach((e) => {
                                console.log(selectedResOff?.office?.["_id"], col["_id"]);

                                if (e.office_id == col["_id"]) {
                                  setSelectedResOff({
                                    office: offices?.find((e) => e["_id"] === col["_id"]),
                                    users: e["users"],
                                  });
                                }
                              });
                            }}
                          >
                            {col.office_name}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="main-content">
                  <div style={{ margin: "1.5rem", fontSize: "1.25rem" }}>{t("admin.offices.no_offices")}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedOfficeReservation !== null && (
          <div
            className="form"
            style={{ flexDirection: "row", marginTop: "13%", marginRight: "3rem", position: "relative" }}
          >
            <div className="top-right-corner">
              {t("admin.seating_chart.num_of_free_seats")}
              {selectedResOff?.office?.num_of_seats - selectedResOff?.users?.length}
            </div>
            <ViewOffice
              numOfRows={selectedResOff?.office?.matrix?.length}
              numOfColumns={selectedResOff?.office?.matrix?.at(0)?.length}
              matrix={selectedResOff?.office?.matrix}
            />
            <div style={{ padding: "1rem" }}>
              <RegisteredWorkersList registredUsers={selectedResOff?.users} simpleList={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminSeatingChart;
