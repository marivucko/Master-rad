import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import {
  fromDateToObjectYMD,
  fromObjectYMDToDate,
  setToMondayIfWeekendSelected,
} from "../../utils/timeDateHelpter";

const DatePicker = ({ dateObject, setDateObject, label, locale, readOnly = false, minDate }) => {
  return (
    <LocalizationProvider locale={locale} dateAdapter={AdapterDateFns}>
      <DesktopDatePicker
        shouldDisableDate={(date) => date.getDay() === 0 || date.getDay() === 6}
        label={label}
        value={fromObjectYMDToDate(dateObject)}
        minDate={minDate ? minDate : new Date("2017-01-01")}
        maxDate={new Date("2023-01-01")}
        onChange={(newValue) => {
          // if (newValue.getDay() != 0 && newValue.getDay() != 6) {
          setDateObject(fromDateToObjectYMD(newValue));
          // }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              label: { color: "rgb(46, 83, 110)" },
              svg: { color: "rgb(46, 83, 110)" },
              input: { color: "rgb(46, 83, 110)" },
            }}
          />
        )}
        onChangeRaw={(e) => e.preventDefault()}
        readOnly={readOnly}
      />
    </LocalizationProvider>
  );
};

export default DatePicker;
