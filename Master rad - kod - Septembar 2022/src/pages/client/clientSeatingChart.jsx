import "../../i18n";
import "./../form.css";
import "./../../App.css";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { GlobalContext } from "../../context/globalContext.js";
import DatePicker from "../../components/datePicker/datePicker";
import { getTodayOrTomorrow, showTodayInsteadOfTomorrow } from "../../utils/timeDateHelpter";
import { setMatrixOfOffices } from "../../utils/pageHelper";
import { getOffices, getReservations } from "../../utils/pageHelper.js";
import ViewOffice from "../../components/viewOfficeReservation/viewOffice/viewOffice";
import RegisteredWorkersList from "../../components/registeredWorkersList/registeredWorkersList";

const ClientSeatingChart = () => {
  const { t } = useTranslation();
  const {
    offices,
    setIsLoading,
    selectedCompany,
    user,
    selectedOfficeReservation,
    countryLocale,
    setOffices,
    setProjects,
    setSelectedOfficeReservation,
    setUsersNames,
  } = useContext(GlobalContext);

  const [officesMatrix, setOfficesMatrix] = useState([]);
  const [officeForThisUser, setofficeForThisUser] = useState("");
  const [selectedResOff, setSelectedResOff] = useState([]);
  const [dateObject, setDateObject] = useState(getTodayOrTomorrow());
  const showTodayOrTomorrow = showTodayInsteadOfTomorrow() ? "today" : "tomorrow";

  const setMatrixOfficesAndUsersOffice = () => {
    setMatrixOfOffices(selectedCompany, setOfficesMatrix, setIsLoading, t);
    const userOfficeId = selectedOfficeReservation?.offices?.find((e) =>
      e.users?.find((elem) => elem === user?.email)
    )?.["office_id"];
    console.log("officeId", userOfficeId);
    if (!!userOfficeId) {
      const o = offices?.find((e) => e["_id"] === userOfficeId);
      setofficeForThisUser(o);
      setSelectedResOff({
        office: o,
        users: selectedOfficeReservation?.offices?.find((e) => e.office_id === userOfficeId)?.users,
      });
    } else {
      setSelectedResOff({
        office: offices?.find((e) => e["_id"] === selectedOfficeReservation?.offices?.at(0)["office_id"]),
        users: selectedOfficeReservation?.offices?.at(0)["users"],
      });
    }
  };

  useEffect(() => {
    getOffices(selectedCompany, setOffices, setIsLoading, t);
    getReservations(
      selectedCompany,
      getTodayOrTomorrow(),
      setSelectedOfficeReservation,
      setSelectedResOff,
      setIsLoading,
      offices,
      t
    );
  }, [selectedCompany, dateObject]);

  useEffect(() => {
    setMatrixOfficesAndUsersOffice();
  }, [selectedOfficeReservation]);

  useEffect(() => {
    setDateObject(getTodayOrTomorrow());
  }, []);

  return (
    <div className="behind-form">
      {selectedOfficeReservation === null ? (
        <div className="form" style={{ marginTop: "20vh", width: "70vh" }}>
          <div className="row-container">
            <h1 className="form-page-name">{t("client.seating_chart.form_title_" + showTodayOrTomorrow)}</h1>
            <DatePicker
              dateObject={dateObject}
              setDateObject={setDateObject}
              label={t("client.seating_chart." + showTodayOrTomorrow)}
              locale={countryLocale.locale}
              readOnly={true}
            />
          </div>
          <h2 className="form-long-text text-color">
            {t("client.seating_chart.no_seating_chart_for_" + showTodayOrTomorrow)}
          </h2>
        </div>
      ) : (
        <div className="behind-form" style={{ flexDirection: "column", alignItems: "center" }}>
          <div>
            <div>
              <div
                className="form"
                style={{ position: "absolute", top: "0", left: "2rem", alignItems: "flex-start" }}
              >
                <div className="row-container">
                  <h1 className="form-page-name">
                    {t("client.seating_chart.form_title_" + showTodayOrTomorrow)}
                  </h1>
                  <DatePicker
                    dateObject={dateObject}
                    setDateObject={setDateObject}
                    label={t("client.seating_chart." + showTodayOrTomorrow)}
                    locale={countryLocale.locale}
                    readOnly={true}
                  />
                </div>
                {selectedOfficeReservation !== null && !officeForThisUser && (
                  <h2 className="form-long-text text-color" style={{ color: "red" }}>
                    {t("client.seating_chart.no_seat_for_this_user_" + showTodayOrTomorrow)}
                  </h2>
                )}
                {selectedOfficeReservation !== null && !!officeForThisUser && (
                  <div style={{ marginTop: "1rem" }}>
                    <h1 className="form-long-text text-color">
                      {t("client.seating_chart.your_office")}
                      {t("client.seating_chart.for_" + showTodayOrTomorrow)}
                      {officeForThisUser["office_name"]}
                    </h1>
                    <h1 className="form-long-text text-color">
                      {t("client.seating_chart.floor")} {officeForThisUser["floor"]}
                    </h1>
                  </div>
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
                        {t("client.seating_chart.select_office")}
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
                      <div style={{ margin: "1.5rem", fontSize: "1.25rem" }}>
                        {t("admin.offices.no_offices")}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="form" style={{ flexDirection: "row", marginTop: "13%", position: "relative" }}>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientSeatingChart;
