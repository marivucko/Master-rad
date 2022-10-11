import React from "react";
import "./formInput.css";
import { useState } from "react";

const FormInput = ({
  icon,
  id,
  name,
  value,
  type,
  placeholder,
  pattern,
  errorMessage,
  onChange,
  min,
  max,
  className = "form-input-with-icon",
  readOnly = false,
}) => {
  const [focused, setFocused] = useState(false);
  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <div className={className}>
      <i className={icon}></i>
      <input
        className="form-input"
        id={id}
        name={name}
        value={value}
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
        min={min}
        max={max}
        step={1}
        readOnly={readOnly}
      />
      {/* <span className="form-input-error">{errorMessage}</span> */}
    </div>
  );
};

export default FormInput;
