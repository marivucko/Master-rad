import React, { useContext } from "react";
import "./sidebar.css";
import { useLocation, NavLink } from "react-router-dom";
import BackDrop from "./../backdrop/backdrop";
import ChooseLanguage from "../chooseLanguage/chooseLanguage";
import { useTranslation } from "react-i18next";
import { GlobalContext } from "../../context/globalContext.js";

const SideBar = () => {
  const { t } = useTranslation();
  const { user, mongoUser, sideBar, toggleSidebar, countryLocale, setCountryLocale, logout } =
    useContext(GlobalContext);

  const location = useLocation();
  const currRoute = location.pathname;

  const isNotOnHomePage = currRoute !== "/";

  const isNotOnAdminHomePage = currRoute !== "/adminHomePage";
  const isNotOnAdminAddOffice = currRoute !== "/adminAddOffice";
  const isNotOnAdminOffices = currRoute !== "/adminOffices";

  const loggedIn = !!user;

  return (
    <div>
      <BackDrop sideBar={sideBar} closeSideBar={toggleSidebar} />
      <div className={sideBar ? "side-bar side-bar--open" : "side-bar"}>
        <i className="bi bi-list icon" id="side-bar-menu" onClick={toggleSidebar}></i>
        <div className="side-bar-links">
          {!loggedIn && (
            <div onClick={toggleSidebar} className="side-bar-link-div">
              <NavLink to="/login" className="side-bar-link">
                <i className="bi bi-box-arrow-in-right icon"></i>
                <span>{t("nav_bar.login")}</span>
              </NavLink>
            </div>
          )}
          {!loggedIn && (
            <div onClick={toggleSidebar} className="side-bar-link-div">
              <NavLink to="/register" className="side-bar-link">
                <i className="bi bi-person-plus icon"></i>
                <span>{t("nav_bar.register")}</span>
              </NavLink>
            </div>
          )}
          {!loggedIn && isNotOnHomePage && (
            <div onClick={toggleSidebar} className="side-bar-link-div">
              <NavLink to="/" className="side-bar-link">
                <i className="bi bi-house-door"></i>
                <span>{t("nav_bar.home_page")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && mongoUser?.admin && isNotOnAdminHomePage && (
            <div onClick={toggleSidebar} className="side-bar-link-div">
              <NavLink to="/adminHomePage" className="side-bar-link">
                <i className="bi bi-house-door add-space"></i>
                <span>{t("nav_bar.admin.home_page")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && mongoUser?.admin && !isNotOnAdminHomePage && (
            <div onClick={toggleSidebar} className="side-bar-link-div">
              <NavLink to="/adminAddCompany" className="side-bar-link">
                <i className="bi bi-plus-circle-dotted add-space"></i>
                <span>{t("nav_bar.admin.add_company")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && mongoUser?.admin && isNotOnAdminHomePage && isNotOnAdminOffices && (
            <div onClick={toggleSidebar} className="side-bar-link-div">
              <NavLink to="/adminOffices" className="side-bar-link">
                <i className="bi bi-card-list add-space"></i>
                <span>{t("nav_bar.admin.offices")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && mongoUser?.admin && isNotOnAdminHomePage && (
            <div onClick={toggleSidebar} className="side-bar-link-div">
              <NavLink to="/adminWorkersMainPage" className="side-bar-link">
                <i className="bi bi-person-lines-fill add-space"></i>
                <span>{t("nav_bar.admin.workers")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && mongoUser?.admin && isNotOnAdminHomePage && (
            <div onClick={toggleSidebar} className="side-bar-link-div">
              <NavLink to="/adminAnalysis" className="side-bar-link">
                <i className="bi bi-bar-chart-line add-space"></i>
                <span>{t("nav_bar.admin.analysis")}</span>
              </NavLink>
            </div>
          )}
          {loggedIn && (
            <div onClick={toggleSidebar} className="side-bar-link-div">
              <div className="side-bar-link" onClick={logout}>
                <i className="bi bi-box-arrow-right add-space"></i>
                <span>{t("nav_bar.sign_out")}</span>
              </div>
            </div>
          )}
          <ChooseLanguage countryLocale={countryLocale} setCountryLocale={setCountryLocale} />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
