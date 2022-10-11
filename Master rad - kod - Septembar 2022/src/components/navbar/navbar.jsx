import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import "./navbar.css";
import ChooseLanguage from "../chooseLanguage/chooseLanguage";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { showTodayInsteadOfTomorrow } from "../../utils/timeDateHelpter";
import { GlobalContext } from "../../context/globalContext.js";

const NavBar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, mongoUser, toggleSidebar, countryLocale, setCountryLocale, setSelectedCompanyId, logout } =
    useContext(GlobalContext);

  const currRoute = location.pathname;
  const isNotOnLoginPage = currRoute !== "/login";
  const isNotOnRegisterPage = currRoute !== "/register";

  const isNotOnAdminHomePage = currRoute !== "/adminHomePage";
  const isNotOnAdminAddOffice = currRoute !== "/adminAddOffice";
  const isNotOnAdminOffices = currRoute !== "/adminOffices";

  const isNotOnClientHomePage = currRoute !== "/clientHomePage";

  const loggedIn = !!user && !!mongoUser;

  const onNavBarClick = () => {
    if (loggedIn && mongoUser?.admin) {
      setSelectedCompanyId("");
    }
  };

  return (
    <div>
      <nav className="nav-bar">
        <NavLink
          onClick={onNavBarClick}
          to={loggedIn ? (mongoUser?.admin ? "/adminHomePage" : "/clientHomePage") : "/"}
        >
          <div className="app-name">
            <span className="app-name-first-word">{t("nav_bar.app_name_first_word")}</span>
            <span className="app-name-second-word">{t("nav_bar.app_name_second_word")}</span>
          </div>
        </NavLink>
        <div className="links">
          {isNotOnLoginPage && !loggedIn && (
            <div className="link">
              <NavLink to="/login">
                <i className="bi bi-box-arrow-in-right icon"></i>
                <span>{t("nav_bar.login")}</span>
              </NavLink>
            </div>
          )}
          {isNotOnRegisterPage && !loggedIn && (
            <div className="link">
              <NavLink to="/register">
                <i className="bi bi-person-plus icon"></i>
                <span>{t("nav_bar.register")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && mongoUser?.admin && !isNotOnAdminHomePage && (
            <div className="link">
              <NavLink to="/adminAddCompany">
                <i className="bi bi-plus-circle-dotted add-space"></i>
                <span>{t("nav_bar.admin.add_company")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && mongoUser?.admin && isNotOnAdminHomePage && (
            <div className="link">
              <NavLink to="/adminOffices">
                <i className="bi bi-card-list add-space"></i>
                <span>{t("nav_bar.admin.offices")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && mongoUser?.admin && isNotOnAdminHomePage && (
            <div className="link">
              <NavLink to="/adminProjects">
                <i className="bi bi-clipboard-data add-space"></i>
                <span>{t("nav_bar.admin.projects")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && mongoUser?.admin && isNotOnAdminHomePage && (
            <div className="link">
              <NavLink to="/adminWorkersMainPage">
                <i className="bi bi-person-lines-fill add-space"></i>
                <span>{t("nav_bar.admin.workers")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && mongoUser?.admin && isNotOnAdminHomePage && (
            <div className="link">
              <NavLink to="/adminSeatingChart">
                <i className="bi bi-calendar-check add-space"></i>
                <span>{t("nav_bar.admin.seating_chart")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && mongoUser?.admin && isNotOnAdminHomePage && (
            <div className="link">
              <NavLink to="/adminAnalysis">
                <i className="bi bi-bar-chart-line add-space"></i>
                <span>{t("nav_bar.admin.analysis")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && !mongoUser?.admin && isNotOnClientHomePage && (
            <div className="link">
              <NavLink to="/clientCoworkers">
                <i className="bi bi-person-lines-fill add-space"></i>
                <span>{t("nav_bar.client.coworkers")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && !mongoUser?.admin && isNotOnClientHomePage && (
            <div className="link">
              <NavLink to="/clientReserveTable">
                <i className="bi bi-grid-3x3-gap add-space"></i>
                <span>{t("nav_bar.client.reserve_table")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && !mongoUser?.admin && isNotOnClientHomePage && (
            <div className="link">
              <NavLink to="/clientSeatingChart">
                <i className="bi bi-calendar-check add-space"></i>
                <span>
                  {showTodayInsteadOfTomorrow()
                    ? t("nav_bar.client.seating_chart_today")
                    : t("nav_bar.client.seating_chart_tomorrow")}
                </span>
              </NavLink>
            </div>
          )}
          {loggedIn && (
            <div className="link" onClick={logout}>
              <i className="bi bi-box-arrow-right add-space"></i>
              <span>{t("nav_bar.sign_out")}</span>
            </div>
          )}
          <i className="bi bi-list icon" id="menu" onClick={toggleSidebar}></i>
          <div id="choose-language">
            <ChooseLanguage countryLocale={countryLocale} setCountryLocale={setCountryLocale} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
