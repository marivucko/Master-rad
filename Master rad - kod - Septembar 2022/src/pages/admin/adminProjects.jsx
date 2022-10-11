import "../../i18n";
import "./../form.css";
import "./../../App.css";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { GlobalContext } from "../../context/globalContext.js";
import { getUsersNames } from "../../utils/pageHelper";
import {
  addProject,
  deleteProject,
  getProjectsFromComapny,
  updateProject,
} from "../../serverCommunicatoin/projectCommunication";
import FormInput from "../../components/input/formInput/formInput";
import { doesUserCompanyExist } from "../../serverCommunicatoin/userCompanyCommunication";
import { toast } from "react-toastify";

const AdminProjects = () => {
  const { t } = useTranslation();
  const { setIsLoading, selectedCompany, projects, setProjects, setUsersNames, getUserName } =
    useContext(GlobalContext);

  const [projectName, setProjectName] = useState();
  const [userToProject, setUserToProject] = useState("");

  useEffect(() => {
    async function getAllProjects() {
      const resultProjects = await getProjectsFromComapny(selectedCompany["_id"], setIsLoading, t);
      if (resultProjects.status === 200) {
        setProjects(resultProjects.projects);
      } else {
        setProjects([]);
      }
    }
    getAllProjects();
    getUsersNames(selectedCompany, setUsersNames, t);
  }, []);

  useEffect(() => {
    getUsersNames(selectedCompany, setUsersNames, t);
  }, [projects]);

  const addNewProject = async (e) => {
    e.preventDefault();
    const result = await addProject(
      {
        project_name: projectName,
        company_id: selectedCompany["_id"],
        users: [],
      },
      setIsLoading,
      t,
      t("admin.projects.project_added_successfully")
    );
    if (result.status === 200) {
      let newProject = result.project;
      setProjects((prevState) => [...prevState, newProject]);
    }
  };

  const deleteSelectedProject = async (index) => {
    const result = await deleteProject(
      projects.at(index)["_id"],
      setIsLoading,
      t,
      t("admin.projects.project_deleted_successfully")
    );
    if (result.status === 200) {
      setProjects((prevState) => [
        ...prevState.slice(0, index),
        ...prevState.slice(index + 1, prevState.length),
      ]);
    }
  };

  const addUserToProject = async (e, index) => {
    e.preventDefault();
    let userCompanyResult = await doesUserCompanyExist(
      userToProject + "/" + selectedCompany["_id"],
      setIsLoading,
      t
    );
    if (userCompanyResult.status === 200) {
      if (!userCompanyResult.userCompany) {
        toast.info(t("admin.projects.worker_does_not_exist"));
        return;
      }
      let alreadyExistsInThisProjec = projects[index].users.some((user) => user === userToProject);
      if (alreadyExistsInThisProjec) {
        toast.info(t("admin.projects.worker_already_in_this_project"));
        return;
      }
      let project = projects.find(
        (e) => e !== projects[index] && e.users.some((user) => user === userToProject)
      );
      if (!!project) {
        toast.info(t("admin.projects.worker_already_in_other_project") + project.project_name + ".");
        return;
      }
      let result = await updateProject(
        {
          project: projects[index],
          users: [...projects[index].users, userToProject],
        },
        setIsLoading,
        t,
        t("admin.projects.worker_added_successfully")
      );
      if (result.status === 200) {
        setProjects((prevProjects) =>
          prevProjects.map((project, currIndex) => {
            if (index === currIndex) {
              return {
                ...project,
                users: [...project.users, userToProject],
              };
            } else {
              return project;
            }
          })
        );
      }
    }
  };

  const deleteUserFromProject = async (userIndex, index) => {
    let result = await updateProject(
      {
        project: projects[index],
        users: [
          ...projects[index].users.slice(0, userIndex),
          ...projects[index].users.slice(userIndex + 1, projects[index].users.length),
        ],
      },
      setIsLoading,
      t,
      t("admin.projects.worker_deleted_successfully")
    );
    if (result.status === 200) {
      setProjects((prevProjects) =>
        prevProjects.map((project, currIndex) => {
          if (index === currIndex) {
            return {
              ...project,
              users: [
                ...project.users.slice(0, userIndex),
                ...project.users.slice(userIndex + 1, project.users.length),
              ],
            };
          } else {
            return project;
          }
        })
      );
    }
  };

  return (
    <div className="behind-form">
      <div className="form" style={{ backgroundColor: "white" }}>
        <h4 className="form-page-name"> {t("admin.projects.workers_by_projects")}</h4>
        <form onSubmit={addNewProject} className="project-wrapper">
          <FormInput
            icon={"bi bi-textarea-t form-input-icon"}
            id={"projectName"}
            name={"projectName"}
            type={"text"}
            placeholder={t("admin.projects.add_project_placeholder")}
            require={true}
            errorMessage={t("admin.projects.project_name_is_empty")}
            onChange={(e) => {
              setProjectName(e.target.value);
            }}
          />
          <button type="submit" className="project-form-button">
            {t("admin.workers.main_page.add_project_button")}
          </button>
        </form>
        <div className="all-project-wrapper">
          {projects.map((p, index) => (
            <div key={p["_id"]} className="project-wrapper">
              <button
                className="delete-project-button bi bi-trash-fill"
                onClick={() => deleteSelectedProject(index)}
              />
              <div className="project-wrapper-list">
                <div>
                  <span className="project-label">{t("admin.projects.project")} </span>
                  <span className="project-name">{p.project_name}</span>
                </div>
                <br />
                {p.users.map((user, userIndex) => (
                  <div key={user} className="project-user-card">
                    <span className="project-user-name">{getUserName(user)}</span>
                    <div>
                      <span className="project-user-email">{user}</span>
                      <button
                        className="bi bi-x-lg"
                        style={{
                          border: "none",
                          cursor: "pointer",
                          color: "var(--nav-bar_color)",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => {
                          deleteUserFromProject(userIndex, index);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <form
                className=" column-container"
                onSubmit={(e) => {
                  addUserToProject(e, index);
                }}
              >
                <FormInput
                  icon={"bi bi-envelope form-input-icon"}
                  id={"projectName"}
                  name={"projectName"}
                  type={"text"}
                  placeholder={t("admin.projects.worker_placeholder")}
                  require={true}
                  errorMessage={t("admin.projects.worker_placeholder_empty")}
                  onChange={(e) => {
                    setUserToProject(e.target.value);
                  }}
                />
                <button className="project-form-button" type="submit">
                  {t("admin.workers.main_page.add_user_button")}
                </button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;
