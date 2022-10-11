import "../../../i18n";
import "./../../../pages/form.css";
import "./../../../App.css";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import emailjs from "emailjs-com";
import FormInput from "../../input/formInput/formInput.jsx";
import "../../../components/input/formInput/formInput.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormInputWithLabel from "../../input/formInputWithLabel/formInputWithLabel";
import FormInputMultiline from "../../input/formInputMultiline/formInputMultiline";
import "./sendEmailForm.css";
import { GlobalContext } from "../../../context/globalContext.js";

const SendEmailForm = () => {
  const { t } = useTranslation();
  const { mongoUser, user, countryLocale } = useContext(GlobalContext);

  const [receiverFullName, setReceiverFullName] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [subject, setSubject] = useState(t("admin.workers.invite_user.subject_suggestion"));
  const [message, setMessage] = useState(t("admin.workers.invite_user.message_suggestion"));

  useEffect(() => {
    setMessage(
      t("send_email_form.send_to_admin.message_suggestion_part_1") +
        receiverFullName +
        t("send_email_form.send_to_admin.message_suggestion_part_2") +
        mongoUser?.full_name
    );
  }, [receiverFullName, countryLocale, mongoUser]);

  const sendEmail = async (e) => {
    emailjs.sendForm("service_hmbttng", "template_jrnu6ej", "#emailForm", "UGXIR3ZYqCzYvN3ks").then(
      (result) => {
        toast.success(t("admin.workers.invite_user.toast_email_sent"));
      },
      (error) => {
        toast.success(t("admin.workers.invite_user.toast_email_not_sent"));
      }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    sendEmail(e);
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="form" id="emailForm" method="post" encType="text/plain">
        <h4 className="new-line title-text">{t("send_email_form.send_to_admin.title")}</h4>
        <FormInput
          icon={"bi bi-person form-input-icon"}
          id={"fullName"}
          name={"fullName"}
          type={"text"}
          placeholder={t("admin.workers.invite_user.user_full_name")}
          require={true}
          errorMessage={t("admin.workers.invite_user.full_name_empty")}
          onChange={(e) => {
            setReceiverFullName(e.target.value);
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
            setReceiverEmail(e.target.value);
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
          className="new-line"
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

export default SendEmailForm;
