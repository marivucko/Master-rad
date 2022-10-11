import "../../i18n";
import "./../form.css";
import "./../../App.css";
import { useTranslation } from "react-i18next";
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useContext, useEffect } from "react";
import {
  fromDateToObjectYMD,
  fromObjectYMDToDate,
  setToMondayIfWeekendSelected,
} from "../../utils/timeDateHelpter";
import { GlobalContext } from "../../context/globalContext.js";
import {
  addSurvey,
  addUserWithoutPlace,
  getSurveysForUserForMonth,
  removeUser,
} from "../../serverCommunicatoin/surveyCommunicatoin";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "../../components/forms/surveyForm/surveyForm.css";
import CustomCalendar from "../../components/customCalendar/customCalendar";
import FormInput from "../../components/input/formInput/formInput";

const ClientReserveTable = () => {
  const { t } = useTranslation();
  const {
    getUsersProjects,
    getUserName,
    setIsLoading,
    user,
    selectedCompanyId,
    countryLocale,
    getUserProject,
    getNumOfSeatsInCompany,
    usersNames,
  } = useContext(GlobalContext);

  let now = new Date();
  const [dateObject, setDateObject] = useState(setToMondayIfWeekendSelected(fromDateToObjectYMD(now)));
  const [surveysForMonth, setSurveysForMonth] = useState([]);
  const [datesOfMonthForUser, setDatesOfMonthForUser] = useState([]);
  const [workersOfSelectedDate, setWorkersOfSelectedDate] = useState([]);
  const [projectsWithUsers, setProjectsWithUsers] = useState([]);
  const [serverResult, setServerResult] = useState();

  const [dateObjectCoworker, setDateObjectCoworker] = useState(
    setToMondayIfWeekendSelected(fromDateToObjectYMD(now))
  );
  const [coworkerEmail, setCoworkerEmail] = useState("");
  const [datesOfMonthForCoworker, setDatesOfMonthForCoworker] = useState([]);

  const onChange = (e) => {
    setCoworkerEmail((prevState) => e.target.value);
  };

  const input = {
    icon: "bi bi-person form-input-icon",
    id: "email",
    name: "email",
    type: "email",
    placeholder: t("client.reserve_table.insert_colleague_email"),
    require: true,
    errorMessage: t("login.email_not_valid_format"),
  };

  async function getSurveysForCoworker(dateObjectCoworker) {
    if (!usersNames?.some((e) => e.email === coworkerEmail)) {
      toast.info(t("client.reserve_table.no_colleague_with_this_email"));
      return;
    }
    const result = await getSurveysForUserForMonth(
      coworkerEmail,
      selectedCompanyId,
      dateObjectCoworker.year,
      dateObjectCoworker.month - 1,
      setIsLoading,
      t
    );
    if (result.status === 200) {
      const fetchedSurveysForMonth = result.userSurveys;

      let datesForUser = [];
      fetchedSurveysForMonth.forEach((e) => {
        if (e.users.some((u) => u === coworkerEmail)) datesForUser.push(fromObjectYMDToDate(e.date));
      });
      setDatesOfMonthForCoworker(datesForUser);
    } else {
      setDatesOfMonthForCoworker([]);
    }
  }

  async function getSurveysForUser(dateObject) {
    const result = await getSurveysForUserForMonth(
      user?.email,
      selectedCompanyId,
      dateObject.year,
      dateObject.month - 1,
      setIsLoading,
      t
    );
    if (result.status === 200) {
      const fetchedSurveysForMonth = result.userSurveys;
      setSurveysForMonth(fetchedSurveysForMonth);

      let datesForUser = [];
      fetchedSurveysForMonth.forEach((e) => {
        if (e.users.some((u) => u === user?.email)) datesForUser.push(fromObjectYMDToDate(e.date));
      });
      setDatesOfMonthForUser(datesForUser);
    } else {
      setSurveysForMonth([]);
      setDatesOfMonthForUser([]);
    }
  }

  useEffect(() => {
    getSurveysForUser(dateObject);
  }, [serverResult]);

  useEffect(() => {
    const workersCheckdInSelectedDate = surveysForMonth?.find(
      (s) => JSON.stringify(s.date) === JSON.stringify(dateObject)
    )?.users;
    setWorkersOfSelectedDate(workersCheckdInSelectedDate);
    const usersProjectsForDate = getUsersProjects(workersCheckdInSelectedDate);
    setProjectsWithUsers(usersProjectsForDate);
  }, [dateObject, surveysForMonth]);

  const add = async () => {
    let userProjct = getUserProject(user?.email);
    if (!userProjct) {
      toast.info(t("client.reserve_table.no_project_assigned_to_user"));
      return;
    }
    let numOfOccupiedSeats = 0;
    if (!!workersOfSelectedDate) {
      numOfOccupiedSeats = workersOfSelectedDate.length;
    }
    if (numOfOccupiedSeats === getNumOfSeatsInCompany()) {
      toast.info(t("client.reserve_table.all_places_fulfilled"));
      await addUserWithoutPlace(
        {
          user: user?.email,
          companyId: selectedCompanyId,
          dateObject: dateObject,
        },
        setIsLoading,
        t
      );
    } else {
      let result = await addSurvey(
        {
          user: user?.email,
          companyId: selectedCompanyId,
          dateObject: dateObject,
        },
        setIsLoading,
        t,
        t("client.reserve_table.success_saving_date")
      );
      setServerResult(result);
    }
    if (user?.email === coworkerEmail) {
      await getSurveysForCoworker(dateObjectCoworker);
    }
  };

  const remove = async () => {
    let result = await removeUser(
      {
        user: user?.email,
        companyId: selectedCompanyId,
        dateObject: dateObject,
      },
      setIsLoading,
      t,
      t("client.reserve_table.success_removing_date")
    );
    setServerResult(result);
    if (user?.email === coworkerEmail) {
      await getSurveysForCoworker(dateObjectCoworker);
    }
  };

  return (
    <div className="behind-form">
      <div className="organize-in-row" style={{ alignItems: "flex-start" }}>
        <div className="form" style={{ marginTop: "2vh", width: "80rem", backgroundColor: "white" }}>
          <h1 className="form-page-name">{t("client.reserve_table.form_title")}</h1>
          <br />
          <CustomCalendar
            locale={countryLocale.localeCustomCal}
            dateObject={dateObject}
            setDateObject={setDateObject}
            dates={datesOfMonthForUser}
            onClickMonth={getSurveysForUser}
          />
          <br />
          {projectsWithUsers?.some(
            (p) => p.project === getUserProject(user?.email) && p.users.some((u) => u === user?.email)
          ) ? (
            <button
              className="button-add"
              onClick={() => {
                remove();
              }}
            >
              {t("client.reserve_table.remove_yourself_button")}
            </button>
          ) : (
            <button
              className="button-add"
              onClick={() => {
                add();
              }}
            >
              {t("client.reserve_table.add_yourself_button")}
            </button>
          )}
          <br />
          <div className="project-label">
            {t("client.reserve_table.num_of_free_seats")}
            {!!workersOfSelectedDate
              ? getNumOfSeatsInCompany() - workersOfSelectedDate.length
              : getNumOfSeatsInCompany()}
          </div>
          {projectsWithUsers?.length > 0 ? (
            <h3> {t("client.reserve_table.people_coming")}</h3>
          ) : (
            <h3> {t("client.reserve_table.no_one_coming")}</h3>
          )}
          <div className="all-project-wrapper">
            {projectsWithUsers?.map((e) => (
              <div
                className={
                  e.project === getUserProject(user?.email) ? "project-wrapper-diff" : "project-wrapper"
                }
                key={e.project}
              >
                <div className="project-wrapper-list">
                  <div>
                    <span className="project-label">{t("admin.projects.project")} </span>
                    <span className="project-name">{e.project}</span>
                  </div>
                  <br />
                  {e.users.map((userEmail, userIndex) => (
                    <div
                      key={userEmail}
                      className={
                        userEmail === user?.email ? "project-user-card-colored" : "project-user-card"
                      }
                    >
                      <span className="project-user-name">{getUserName(userEmail)}</span>
                      <div>
                        <span className="project-user-email">{userEmail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="form" style={{ marginTop: "5vh", backgroundColor: "white", marginLeft: "3rem" }}>
          <h1 className="form-page-name">{t("client.reserve_table.see_colleague_schedule")}</h1>
          <CustomCalendar
            locale={countryLocale.localeCustomCal}
            dateObject={dateObjectCoworker}
            setDateObject={setDateObjectCoworker}
            dates={datesOfMonthForCoworker}
            onClickMonth={getSurveysForCoworker}
          />
          <br />
          <form
            className="column-container"
            onSubmit={(e) => {
              e.preventDefault();
              getSurveysForCoworker(dateObjectCoworker);
            }}
          >
            <FormInput key={input.id} {...input} value={coworkerEmail} onChange={onChange} />
            <button className="button-add" type="submit">
              {t("client.reserve_table.search_colleague_schedule_button")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientReserveTable;
