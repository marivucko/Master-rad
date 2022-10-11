import React from "react";
import "./numberInput.css";
import { useState } from "react";

const NumberInput = ({
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
    <div className="form-input-with-icon">
      <div>{label}</div>
      <input type="number" />
      {/* <input
        className="form-input"
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required
        pattern={pattern}
        onChange={onChange}
        onBlur={handleFocus}
        onFocus={() => name === "confirm-password" && setFocused(true)}
        focused={focused.toString()}
      /> */}
      <span className="form-input-error">{errorMessage}</span>
    </div>
  );
};

export default NumberInput;
