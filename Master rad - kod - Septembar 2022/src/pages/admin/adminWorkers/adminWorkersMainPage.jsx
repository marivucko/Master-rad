import "../../../i18n";
import "./../../form.css";
import "./../../../App.css";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  getRegisteredUsersInComapny,
  getInvitedUsersToComapny,
} from "../../../serverCommunicatoin/userCompanyCommunication";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../context/globalContext.js";
import { getUsersNames } from "../../../utils/pageHelper";
import RegisteredWorkersList from "../../../components/registeredWorkersList/registeredWorkersList";

const AdminWorkersMainPage = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const { setIsLoading, selectedCompanyId, selectedCompany, setUsersNames } = useContext(GlobalContext);

  const [registredUsers, setRegistreUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);

  useEffect(() => {
    async function getUsers() {
      let resultUsersInCompany = await getRegisteredUsersInComapny(selectedCompanyId, setIsLoading, t);
      if (resultUsersInCompany.status === 200) {
        setRegistreUsers(resultUsersInCompany.userCompanies);
      } else {
        setRegistreUsers([]);
      }
      let resultInvitedUsers = await getInvitedUsersToComapny(selectedCompanyId, setIsLoading, t);
      if (resultInvitedUsers.status === 200) {
        setInvitedUsers(resultInvitedUsers.userCompanies);
      } else {
        setInvitedUsers([]);
      }
    }
    getUsers();
    getUsersNames(selectedCompany, setUsersNames, t);
  }, []);

  return (
    <div className="behind-form">
      <div className="form">
        <h4 className="form-page-name">{t("admin.workers.main_page.registered_workers")}</h4>
        <RegisteredWorkersList registredUsers={registredUsers} />
      </div>
      <div className="form">
        <h4 className="form-page-name">{t("admin.workers.main_page.invited_users")}</h4>
        {invitedUsers?.map((invitedUser) => {
          return (
            <div key={invitedUser["_id"]} className="invited-users">
              {invitedUser.email}
            </div>
          );
        })}
        <br />
        <button
          className="project-form-button"
          onClick={() => {
            navigate("/adminWorkersInviteUser");
          }}
        >
          {t("admin.workers.main_page.invite_user_button")}
        </button>
      </div>
    </div>
  );
};

export default AdminWorkersMainPage;
