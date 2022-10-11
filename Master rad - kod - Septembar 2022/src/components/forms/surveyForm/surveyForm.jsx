import "../../../i18n";
import "./surveyForm.css";
import "./../../../App.css";
import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from "../../timePicker/timePicker";
import padStart from "lodash.padstart";
import { addSurvey } from "../../../serverCommunicatoin/surveyCommunicatoin";

const SurveyForm = ({ user, selectedCompanyId }) => {
  const { t } = useTranslation();
  let now = new Date();

  const [startTime, setStartTime] = useState({
    hour: now.getHours(),
    minute: now.getMinutes(),
  });
  const [endTime, setEndTime] = useState({
    hour: now.getHours(),
    minute: now.getMinutes(),
  });
  const onChangeStartTime = (time) => {
    setStartTime(time);
    if (time.hour > endTime.hour || (time.hour === endTime.hour && time.minute >= endTime.minute)) {
      setEndTime(time);
    }
  };
  const onChangeEndTime = (time) => {
    setEndTime(time);
    if (time.hour < startTime.hour || (time.hour === startTime.hour && time.minute <= startTime.minute)) {
      setStartTime(time);
    }
  };

  const options = [
    { value: 1, label: t("survey.day.monday") },
    { value: 2, label: t("survey.day.tuesday") },
    { value: 3, label: t("survey.day.wednesday") },
    { value: 4, label: t("survey.day.thursday") },
    { value: 5, label: t("survey.day.friday") },
  ];

  const [currOption, setCurrOption] = useState(1);
  const [chosenOptions, setChosenOptions] = useState([]);

  const changeOption = (e) => {
    setCurrOption(+e.target.value);
  };

  const addChoice = () => {
    setChosenOptions((prevState) => [
      ...prevState,
      {
        day: currOption,
        start_time: { hour: startTime.hour, minute: startTime.minute },
        end_time: { hour: endTime.hour, minute: endTime.minute },
      },
    ]);
  };

  const removeChoice = (index) => {
    setChosenOptions([
      ...chosenOptions.slice(0, index),
      ...chosenOptions.slice(index + 1, chosenOptions.length),
    ]);
  };

  const save = () => {
    addSurvey({
      user: user?.email,
      companyId: selectedCompanyId,
      chosenOptions: chosenOptions,
      // day: chosenOptions.day,
      // time_table: {
      //   user: user?.email,
      //   start_time: chosenOptions.start_time,
      //   end_time: chosenOptions.end_time,
      // },
    });
  };

  const formatTime = (optionElement) => {
    return (
      optionElement.start_time.hour +
      ":" +
      padStart(optionElement.start_time.minute, 2, "0") +
      "-" +
      optionElement.end_time.hour +
      ":" +
      padStart(optionElement.end_time.minute, 2, "0")
    );
  };

  return (
    <div className="form">
      <h1 className="form-page-name">{t("home.welcome")}</h1>
      <h4 className="form-long-text">{t("home.app_description")}</h4>
      <div className="survey-in-line">
        <select className="day-picker" value={currOption} onChange={changeOption}>
          {options.map((e) => (
            <option value={e.value} key={e.value}>
              {e.label}
            </option>
          ))}
        </select>
        <TimePicker
          time={startTime}
          onChange={onChangeStartTime}
          label={"Start"}
          // startTime={company.start_time}
          // endTime={company.end_time}
          includeStartTime={true}
          includeEndTime={true}
        />
        <TimePicker
          time={endTime}
          onChange={onChangeEndTime}
          label={"End"}
          // startTime={company.start_time}
          // endTime={company.end_time}
          includeStartTime={true}
          includeEndTime={true}
        />
        <button className="button-add" onClick={addChoice}>
          {t("survey.add_button")}
        </button>
      </div>
      <br />
      {chosenOptions.map((currElement, index) => (
        <div key={index} className="day-time-chosen">
          <div>
            {options.find((e) => e.value === currElement.day)?.label}
            <span className="time-chosen">{formatTime(currElement)}</span>
          </div>
          <i
            className="bi bi-x day-time-chosen-close-icon"
            onClick={() => {
              removeChoice(index);
            }}
          ></i>
        </div>
      ))}
      <button
        style={{ display: chosenOptions?.length > 0 ? "flex" : "none" }}
        className="confirm-button"
        onClick={save}
      >
        {t("survey.save_button")}
      </button>
    </div>
  );
};

export default SurveyForm;
