import "../../i18n";
import "./../form.css";
import "./../../App.css";
import { useTranslation } from "react-i18next";
import React, { useState, useContext, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { GlobalContext } from "../../context/globalContext.js";

const ClientCoworkers = () => {
  const { t } = useTranslation();
  const { usersNames, getUsersProjects, getUserName, setIsLoading, user, selectedCompanyId, getUserProject } =
    useContext(GlobalContext);

  let now = new Date();
  const [projectsWithUsers, setProjectsWithUsers] = useState([]);

  useEffect(() => {
    const allUsersProjects = getUsersProjects(usersNames.map((e) => e.email));
    console.log({ usersNames });
    console.log({ allUsersProjects });
    setProjectsWithUsers(allUsersProjects);
  }, []);

  return (
    <div className="behind-form">
      <div className="form" style={{ marginTop: "7vh", backgroundColor: "white" }}>
        <h1 className="form-page-name">{t("client.coworkers.form_title")}</h1>
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
                    className={userEmail === user?.email ? "project-user-card-colored" : "project-user-card"}
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
    </div>
  );
};

export default ClientCoworkers;
