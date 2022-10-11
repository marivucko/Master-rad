import React from "react";
import "./formInputMultiline.css";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

const FormInputMultiline = ({
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
    <div className="form-input-multiline">
      <div className="form-input-multiline-label">{label}</div>
      <TextareaAutosize
        className="form-input-multiline-input"
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

export default FormInputMultiline;
