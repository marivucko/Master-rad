import React from "react";
import "./formCheckBox.css";
import { useState } from "react";

const FormCheckBox = ({
  id,
  name,
  type,
  labelLong,
  labelShort,
  placeholder,
  pattern,
  onChange,
  checked,
  onChangeCheckBox,
}) => {
  const [focused, setFocused] = useState(false);
  const handleFocus = (e) => {
    setFocused(true);
  };

  return (
    <div className="form-checkbox" onClick={onChange}>
      <input
        type="checkbox"
        id="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <div className="form-checkbox-label long">{labelLong}</div>
      <div className="form-checkbox-label short">{labelShort}</div>
    </div>
  );
};

export default FormCheckBox;
