import React, { useState, useContext } from "react";
import "./form.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config.js";
import { useTranslation } from "react-i18next";
import FormInput from "../components/input/formInput/formInput.jsx";
import { useNavigate } from "react-router-dom";
import { getUser } from "../serverCommunicatoin/userCommunication";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GlobalContext } from "../context/globalContext.js";

const Login = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const { setIsLoading } = useContext(GlobalContext);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const inputs = [
    {
      icon: "bi bi-person form-input-icon",
      id: "email",
      name: "email",
      type: "email",
      placeholder: t("login.email"),
      require: true,
      errorMessage: t("login.email_not_valid_format"),
    },
    {
      icon: "bi bi-lock form-input-icon",
      id: "password",
      name: "password",
      type: "password",
      placeholder: t("login.password"),
      errorMessage: "",
    },
  ];

  const login = async (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(
      auth,
      values.email,
      values.password
      // "Mm@2arina"
    )
      .then(async (userCredential) => {
        let reuslt = await getUser(values.email, setIsLoading, t);
        if (reuslt.status === 200) {
          let mongoUser = reuslt.user;
          if (mongoUser.admin) {
            navigate("/adminHomePage");
          } else {
            navigate("/clientHomePage");
          }
        } else {
          toast.info(t("login.auth_user_not_found"));
        }
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          toast.info(t("login.auth_user_not_found"));
        } else if (error.code === "auth/wrong-password") {
          toast.error(t("login.auth_wrong_password"));
        } else {
          toast.error(t("login.error") + error);
        }
        return;
      });
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="behind-form">
      <form
        className="form"
        onSubmit={(event) => {
          login(event);
        }}
      >
        <h1 className="form-page-name">{t("login.form_title")}</h1>
        {inputs.map((input) => (
          <FormInput key={input.id} {...input} value={values[input.name]} onChange={onChange} />
        ))}
        <button className="form-button" type="submit">
          {t("login.submit")}
        </button>
      </form>
    </div>
  );
};

export default Login;
