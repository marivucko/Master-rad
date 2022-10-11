import React, { useContext, useState } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase-config.js";
import "./form.css";
import { useTranslation } from "react-i18next";
import FormInput from "../components/input/formInput/formInput.jsx";
import { useNavigate } from "react-router-dom";
import { addUser } from "../serverCommunicatoin/userCommunication.js";
import FormCheckBox from "../components/formCheckBox/formCheckBox.jsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setUserRegistered } from "../serverCommunicatoin/userCompanyCommunication.js";
import { GlobalContext } from "../context/globalContext.js";

const Register = () => {
  const { t } = useTranslation();
  let navigate = useNavigate();
  const { setIsLoading, setMongoUser } = useContext(GlobalContext);

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [checked, setChecked] = useState(false);

  const onChangeCheckBox = () => {
    setChecked((prevState) => !prevState);
  };

  const inputs = [
    {
      icon: "bi bi-person form-input-icon",
      id: "fullName",
      name: "fullName",
      type: "fullName",
      placeholder: t("register.full_name"),
      require: true,
      errorMessage: t("register.full_name_not_valid_format"),
    },
    {
      icon: "bi bi-envelope form-input-icon",
      id: "email",
      name: "email",
      type: "email",
      placeholder: t("register.email"),
      require: true,
      errorMessage: t("register.email_not_valid_format"),
    },
    {
      icon: "bi bi-lock form-input-icon",
      id: "password",
      name: "password",
      type: "password",
      placeholder: t("register.password"),
      pattern: "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
      errorMessage: t("register.passowrd_not_valid_format"),
    },
    {
      icon: "bi bi-lock form-input-icon",
      id: "confirmPassword",
      name: "confirmPassword",
      type: "password",
      placeholder: t("register.confirm-password"),
      pattern: values.password,
      errorMessage: t("register.password_and_confim_password_not_equal"),
    },
  ];

  const register = async (e) => {
    e.preventDefault();

    await createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        let result = await addUser({ ...values, admin: checked }, setIsLoading, t);
        if (result.status === 200) {
          if (checked) {
            navigate("/adminHomePage");
          } else {
            await setUserRegistered({ email: values.email }, setIsLoading, t);
            navigate("/clientHomePage");
          }
        }
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          toast.info(t("register.auth_email_already_in_use"));
        } else if (error.code === "auth/operation-not-allowed") {
          toast.info(t("register.auth_operation_not_allowed"));
        } else {
          toast.info(t("register.error") + error);
        }
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
          register(event);
        }}
      >
        <h1 className="form-page-name">{t("register.form_title")}</h1>
        {inputs.map((input) => (
          <FormInput key={input.id} {...input} value={values[input.name]} onChange={onChange} />
        ))}
        <FormCheckBox
          checked={checked}
          onChange={onChangeCheckBox}
          labelLong={t("register.admin_long")}
          labelShort={t("register.admin_short")}
        />

        <button className="form-button" type="submit">
          {t("register.submit")}
        </button>
      </form>
    </div>
  );
};

export default Register;
