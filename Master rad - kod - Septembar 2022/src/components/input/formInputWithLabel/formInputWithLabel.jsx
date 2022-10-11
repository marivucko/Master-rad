import React from "react";
import "./formInputWithLabel.css";
import { useState } from "react";

const FormInputWithLabel = ({
  value,
  label,
  id,
  name,
  type,
  placeholder,
  pattern,
  errorMessage,
  onChange,
}) => {
  const [focused, setFocused] = useState(false);
  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <div className="form-input-with-label">
      <div className="form-input-with-label-label">{label}</div>
      <input
        className="form-input-with-label-input"
        value={value}
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required
        pattern={pattern}
        onChange={onChange}
        onBlur={handleFocus}
        onInvalid={(e) => e.target.setCustomValidity(errorMessage)}
        onInput={(e) => e.target.setCustomValidity("")}
        onFocus={() => name === "confirmPassword" && setFocused(true)}
        focused={focused.toString()}
      />
    </div>
  );
};

export default FormInputWithLabel;
