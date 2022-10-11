import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "react-calendar";
import "./customCalendar.css";
import { dateInDatesArray, fromDateToObjectYMD, twoDatesAreSame } from "../../utils/timeDateHelpter";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const CustomCalendar = ({ dateObject, setDateObject, dates = [], locale, onClickMonth }) => {
  return (
    <LocalizationProvider locale={locale} dateAdapter={AdapterDateFns}>
      <Calendar
        onChange={(newValue) => {
          // if (newValue.getDay() != 0 && newValue.getDay() != 6) {
          setDateObject(fromDateToObjectYMD(newValue));
          // }
        }}
        tileContent={({ activeStartDate, date, view }) =>
          view === "month" && dateInDatesArray(date, dates) ? <div className="selected" /> : null
        }
        locale={locale}
        onActiveStartDateChange={({ action, activeStartDate, value, view }) => {
          setDateObject(fromDateToObjectYMD(activeStartDate));
          onClickMonth(fromDateToObjectYMD(activeStartDate));
        }}
        showNeighboringMonth={false}
        formatShortWeekday={(locale, date) => date.toLocaleDateString(locale, { weekday: "narrow" })}
      />
    </LocalizationProvider>
  );
};

export default CustomCalendar;
