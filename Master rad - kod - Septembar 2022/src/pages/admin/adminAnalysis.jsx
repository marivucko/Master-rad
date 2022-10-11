import "../../i18n";
import "./../form.css";
import "./../../App.css";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { GlobalContext } from "../../context/globalContext.js";
import { fromDateToObjectYMD, setToMondayIfWeekendSelected } from "../../utils/timeDateHelpter";
import DatePicker from "../../components/datePicker/datePicker";
import { toast } from "react-toastify";
import { getSurveysOccupancyForWeek } from "../../serverCommunicatoin/surveyCommunicatoin";
import AnalysisBarChart from "../../components/analysisBarChart/analysisBarChart";

const AdminAnalysis = () => {
  const { t } = useTranslation();
  const { setIsLoading, selectedCompany, countryLocale, getNumOfSeatsInCompany } = useContext(GlobalContext);

  let now = new Date();
  const [dateObject, setDateObject] = useState(setToMondayIfWeekendSelected(fromDateToObjectYMD(now)));
  const [statistics, setStatistics] = useState();
  const numOfSeats = getNumOfSeatsInCompany();

  async function getOccupancyForWeek(selectedCompany, dateObject) {
    let result = await getSurveysOccupancyForWeek(selectedCompany?.["_id"], dateObject, setIsLoading, t);
    if (result.status === 200) {
      setStatistics(result.statistics);
    } else {
      toast.error(t("admin.add_company.error_loading_offices"));
    }
  }

  useEffect(() => {
    getOccupancyForWeek(selectedCompany, dateObject);
  }, [dateObject]);

  return (
    <div className="behind-form">
      <div className="form" style={{ marginTop: "5vh", width: "90vh", backgroundColor: "white" }}>
        <h1 className="form-page-name">{t("admin.analysis.form_title")}</h1>
        <div className="row-container">
          <h4 className="form-long-text">{t("admin.analysis.form_text")}</h4>
          <DatePicker
            dateObject={dateObject}
            setDateObject={setDateObject}
            label={t("admin.analysis.select_date")}
            locale={countryLocale.locale}
          />
        </div>
        <br />
        <AnalysisBarChart dateObject={dateObject} statistics={statistics} numOfSeats={numOfSeats} />
        <br />
      </div>
    </div>
  );
};

export default AdminAnalysis;
