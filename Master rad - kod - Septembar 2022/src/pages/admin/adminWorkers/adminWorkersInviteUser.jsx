import "../../../i18n";
import "./../../form.css";
import "./../../../App.css";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import emailjs from "emailjs-com";
import {
  addUserCompany,
  doesUserCompanyExist,
} from "../../../serverCommunicatoin/userCompanyCommunication.js";
import FormInput from "../../../components/input/formInput/formInput.jsx";
import "../../../components/input/formInput/formInput.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormInputWithLabel from "../../../components/input/formInputWithLabel/formInputWithLabel";
import FormInputMultiline from "../../../components/input/formInputMultiline/formInputMultiline";
import { getUser } from "../../../serverCommunicatoin/userCommunication";
import { APP_URL } from "../../../serverCommunicatoin/baseServerCommunicaton";
import { GlobalContext } from "../../../context/globalContext.js";
import { useNavigate } from "react-router-dom";

const AdminWorkersInviteUser = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const { setIsLoading, user, selectedCompanyId, selectedCompany, countryLocale } = useContext(GlobalContext);

  const [adminFullName, setAdminFullName] = useState("");
  const [userFullName, setUserFullName] = useState("");
  const [inviteUser, setInviteUser] = useState("");
  const [subject, setSubject] = useState(t("admin.workers.invite_user.subject_suggestion"));
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function getAdminCompany() {
      const result = await getUser(user?.email, setIsLoading, t);
      if (result.status === 200) {
        const fetchedAdmin = result.user;
        setAdminFullName(fetchedAdmin?.full_name);
      }
    }
    getAdminCompany();
  }, [user]);

  useEffect(() => {
    setMessage(
      t("admin.workers.invite_user.message_suggestion_part_1") +
        userFullName +
        t("admin.workers.invite_user.message_suggestion_part_2") +
        selectedCompany.company_name +
        t("admin.workers.invite_user.message_suggestion_part_3") +
        "(" +
        APP_URL +
        "). " +
        t("admin.workers.invite_user.message_suggestion_part_4") +
        adminFullName
    );
  }, [user, selectedCompany, userFullName, adminFullName, countryLocale]);

  const sendEmail = async (e) => {
    emailjs.sendForm("service_hmbttng", "template_jrnu6ej", "#emailForm", "UGXIR3ZYqCzYvN3ks").then(
      (result) => {
        toast.success(t("admin.workers.invite_user.toast_email_sent"));
        setTimeout(() => {
          navigate("/adminWorkersMainPage");
        }, 1000);
      },
      (error) => {
        toast.success(t("admin.workers.invite_user.toast_email_not_sent"));
        setTimeout(() => {
          navigate("/adminWorkersMainPage");
        }, 1000);
      }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let result = await doesUserCompanyExist(inviteUser + "/" + selectedCompanyId, setIsLoading, t);
    if (result.status === 200) {
      if (!result.userCompany) {
        let resultAddUserCompany = await addUserCompany(
          {
            email: inviteUser,
            company_id: selectedCompanyId,
            registered: false,
          },
          setIsLoading,
          t
        );
        if (resultAddUserCompany.status === 200) {
          sendEmail(e);
        }
      } else if (result.userCompany.registered) {
        toast.info(t("admin.workers.invite_user.tosat_already_registered"));
      } else {
        toast.info(t("admin.workers.invite_user.tosat_already_invited"));
      }
    } else {
      toast.info(t("admin.workers.invite_user.server_error"));
    }
  };

  return (
    <div className="behind-form">
      <form onSubmit={onSubmit} className="form" id="emailForm" method="post" enctype="text/plain">
        <h4>{t("admin.workers.invite_user.title")}</h4>
        <FormInput
          icon={"bi bi-person form-input-icon"}
          id={"fullName"}
          name={"fullName"}
          type={"text"}
          placeholder={t("admin.workers.invite_user.user_full_name")}
          require={true}
          errorMessage={t("admin.workers.invite_user.full_name_empty")}
          onChange={(e) => {
            setUserFullName(e.target.value);
          }}
        />
        <FormInput
          icon={"bi bi-envelope form-input-icon"}
          id={"email"}
          name={"email"}
          type={"email"}
          placeholder={t("admin.workers.invite_user.user_email")}
          require={true}
          errorMessage={t("login.email_not_valid_format")}
          onChange={(e) => {
            setInviteUser(e.target.value);
          }}
        />
        <FormInputWithLabel
          value={subject}
          label={t("admin.workers.invite_user.subject")}
          id={"subject"}
          name={"subject"}
          type={"text"}
          placeholder=""
          require={true}
          errorMessage={t("admin.workers.invite_user.subject_error")}
          onChange={(e) => {
            setSubject(e.target.value);
          }}
        />
        <FormInputMultiline
          label={t("admin.workers.invite_user.message")}
          value={message}
          id={"message"}
          name={"message"}
          type={"text"}
          placeholder=""
          require={true}
          errorMessage={t("admin.workers.invite_user.message_error")}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <button className="form-button" type="submit">
          {t("admin.workers.invite_user.invite")}
        </button>
      </form>
    </div>
  );
};

export default AdminWorkersInviteUser;
