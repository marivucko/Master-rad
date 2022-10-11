import React, { useEffect, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { getOfficiesFromComapny } from "../../serverCommunicatoin/officeCommunication.js";
import { useNavigate } from "react-router-dom";
import FormInput from "../../components/input/formInput/formInput.jsx";
import { GlobalContext } from "../../context/globalContext.js";
import { fromTimeObjectToString, getTodayOrTomorrow } from "../../utils/timeDateHelpter.js";
import { toast } from "react-toastify";
import { getReservationFromComapnyForDate } from "../../serverCommunicatoin/reservationCommunication";
import { getProjectsFromComapny } from "../../serverCommunicatoin/projectCommunication.js";
import { getRegisteredUserNamesInCompany } from "../../serverCommunicatoin/userCompanyCommunication.js";
import { getSurveysForUserForThisWeek } from "../../serverCommunicatoin/surveyCommunicatoin.js";
import { getOffices, getProjects, getUsersNames, getReservations } from "../../utils/pageHelper.js";

const ClientCompanyDetails = () => {
  const { t } = useTranslation();
  const {
    setIsLoading,
    selectedCompany,
    setOffices,
    setProjects,
    setSelectedOfficeReservation,
    setUsersNames,
  } = useContext(GlobalContext);
  let navigate = useNavigate();
  const [selectedResOff, setSelectedResOff] = useState([]);

  useEffect(() => {
    getUsersNames(selectedCompany, setUsersNames, setIsLoading, t);
    getProjects(selectedCompany, setProjects, setIsLoading, t);
    getOffices(selectedCompany, setOffices, setIsLoading, t);
    // getReservations(
    //   selectedCompany,
    //   getTodayOrTomorrow(),
    //   setSelectedOfficeReservation,
    //   setSelectedResOff,
    //   setIsLoading,
    //   t
    // );
  }, [selectedCompany]);

  const values = {
    company_name: t("admin.company_details.company_name") + " " + selectedCompany?.company_name,
    address: t("admin.company_details.address") + " " + selectedCompany?.address,
    contact_email: t("admin.company_details.contact_email") + " " + selectedCompany?.contact_email,
    contact_number: t("admin.company_details.contact_number") + " " + selectedCompany?.contact_number,
    start_time:
      t("admin.company_details.start_time") + " " + fromTimeObjectToString(selectedCompany?.start_time),
    end_time: t("admin.company_details.end_time") + " " + fromTimeObjectToString(selectedCompany?.end_time),
  };

  const inputs = [
    {
      icon: "bi bi-building form-input-icon",
      id: "company_name",
      name: "company_name",
    },
    {
      icon: "bi bi-geo-alt form-input-icon",
      id: "address",
      name: "address",
    },
    {
      icon: "bi bi-envelope form-input-icon",
      id: "contact_email",
      name: "contact_email",
    },
    {
      icon: "bi bi-telephone form-input-icon",
      id: "contact_number",
      name: "contact_number",
    },
    {
      icon: "bi bi-hourglass-top form-input-icon",
      id: "start_time",
      name: "start_time",
    },
    {
      icon: "bi bi-hourglass-bottom form-input-icon",
      id: "end_time",
      name: "end_time",
    },
  ];

  return (
    <div className="behind-form">
      <div className="form" style={{ padding: "2rem 5rem" }}>
        <h1 className="form-page-name">{t("admin.company_details.form_title")}</h1>
        {inputs.map((input) => (
          <FormInput key={input.id} {...input} value={values[input.name]} readOnly={true} />
        ))}
      </div>
    </div>
  );
};

export default ClientCompanyDetails;
