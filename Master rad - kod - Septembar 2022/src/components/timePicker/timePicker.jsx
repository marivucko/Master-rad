import React, { Component, setState } from "react";
import "./timePicker.css";
import padStart from "lodash.padstart";
import TextField from "@mui/material/TextField";
import BackDrop from "./../../components/backdrop/backdrop";

function TimeGridCell(props) {
  let minstr = padStart(props.minute.toString(), 2, "0");
  return (
    <div
      className={
        "timegrid__min timegrid__min" +
        minstr +
        (props.selected ? " timegrid__min-selected" : " timegrid__min-unselected")
      }
      onClick={props.onClick}
    >
      {":" + minstr}
    </div>
  );
}

function formatTime12(time) {
  let meridiem = time.hour < 12 ? "am" : "pm";
  let hour = time.hour > 12 ? time.hour - 12 : time.hour;
  hour = hour || 12;
  return hour.toString() + ":" + padStart(time.minute.toString(), 2, "0") + meridiem;
}

function formatTime24(time) {
  return time.hour.toString() + ":" + padStart(time.minute.toString(), 2, "0");
}

class TimeGrid extends Component {
  render() {
    return (
      <div className="timegrid__container">
        {this.renderTimeGridColumn("am")}
        {this.renderTimeGridColumn("pm")}
      </div>
    );
  }

  // meridiem argument should be "am" or "pm"
  renderTimeGridColumn(meridiem) {
    return (
      <div className={"timegrid__" + meridiem + "col"}>
        {/* <div className="timegrid__colheader">{meridiem.toUpperCase()}</div> */}
        {this.renderTimeGridHours(meridiem)}
      </div>
    );
  }

  handleClickTimeCell(t, change) {
    if (change) {
      this.props.onChange(t);
      this.props.onClose();
    }
  }

  renderTimeGridHours(meridiem) {
    const selHour = this.props.selectedTime && this.props.selectedTime.hour;
    const selMin = this.props.selectedTime && this.props.selectedTime.minute;
    let hours = [];
    const hourBase = meridiem === "pm" ? 12 : 0;

    let includeStartTime = this.props.includeStartTime != null ? this.props.includeStartTime : true;
    let h_min_minute = this.props.startTime ? this.props.startTime.minute : 0;
    let h_min_hour_is_greater = h_min_minute === 45 && !this.props.includeStartTime;
    let h_min_hour = this.props.startTime ? this.props.startTime.hour + h_min_hour_is_greater : 0;

    let includeEndTime = this.props.includeEndTime != null ? this.props.includeEndTime : true;
    let h_max_minute = this.props.endTime ? this.props.endTime.minute : 45;
    let h_max_hour_is_smaller = h_max_minute === 0 && !this.props.includeEndTime;
    let h_max_hour = this.props.endTime ? this.props.endTime.hour - h_max_hour_is_smaller : 23;

    let h_avg = Math.trunc((h_min_hour + h_max_hour) / 2);
    let h_min = meridiem === "am" ? h_min_hour : h_avg + 1;
    let h_max = meridiem === "am" ? h_avg : h_max_hour;
    for (let h = h_min; h <= h_max; ++h) {
      let h24 = h;
      let hstr = padStart(h24.toString(), 2, "0");
      let timeGridCells = [];
      for (let j = 0; j <= 45; j = j + 15) {
        if (
          (h * 60 + j > h_min_hour * 60 + h_min_minute ||
            (h * 60 + j >= (h_min_hour - h_min_hour_is_greater) * 60 + h_min_minute && includeStartTime) ||
            h_min_hour_is_greater) &&
          (h * 60 + j < h_max_hour * 60 + h_max_minute ||
            (h * 60 + j == h_max_hour * 60 + h_max_minute && includeEndTime) ||
            h_max_hour_is_smaller)
        )
          timeGridCells.push(
            <TimeGridCell
              key={h * 60 + j}
              hour={h}
              minute={j}
              selected={selHour === h24 && selMin === j}
              onClick={this.handleClickTimeCell.bind(this, { h24, m: j }, true)}
            />
          );
      }
      let min_time_clickable = h > h_min_hour || (h === h_min_hour && h_min_minute === 0 && includeStartTime);
      hours.push(
        <div key={h} className={"timegrid__hour timegrid__hour" + hstr}>
          <div
            className={
              "timegrid__hourtext" +
              (selHour === h24 ? " timegrid__hourtext-selected" : " timegrid__hourtext-unselected")
            }
            style={{ cursor: min_time_clickable ? "pointer" : "default" }}
            onClick={this.handleClickTimeCell.bind(this, { h24, m: 0 }, min_time_clickable)}
          >
            {h}:00
          </div>
          <div className="timegrid__minutes"> {timeGridCells}</div>
        </div>
      );
    }
    return hours;
  }
}

export default class TimePicker extends Component {
  state = {
    timerPickerOpened: false,
  };

  clickTimerPicker() {
    this.setState((prevState) => {
      return { timerPickerOpened: !prevState.timerPickerOpened };
    });
  }

  handleTimeGridChange(t) {
    if (this.props.onChange) {
      this.props.onChange({ hour: t.h24, minute: t.m });
    }
  }

  handleInputChange(e) {
    let parsed = TimePicker.parseTimeString(e.target.value);

    if (parsed && this.props.onChange) {
      this.props.onChange(parsed);
    }
  }

  render() {
    if (typeof this.props.displayFormat === "function") {
      var formatter = this.props.displayFormat;
    } else {
      var formatter = this.props.displayFormat === "12-hour" ? formatTime12 : formatTime24;
    }
    let timeStr = formatter(this.props.time);
    return (
      <div>
        <BackDrop sidebar={this.state.timerPickerOpened} closeSideBar={this.clickTimerPicker.bind(this)} />
        <div
          className={
            "timepicker__container" +
            (this.state.timerPickerOpened ? " timepicker__container__open" : " timepicker__container__closed")
          }
        >
          <div
            className={"timepicker__display" + (this.props.style ? " style_form" : "")}
            onClick={this.clickTimerPicker.bind(this)}
          >
            {this.props.style == null && <label className="label_back">{this.props.label}</label>}
            <label>{this.props.label}</label>
            <input
              className="timepicker_input_font"
              type="text"
              value={timeStr}
              onChange={this.handleInputChange.bind(this)}
            ></input>
            <i className="fa fa-clock-o fa" style={{ color: "rgb(46, 83, 110)", fontSize: "1.3rem" }}></i>
          </div>
          <div className="timepicker__droplist">
            <TimeGrid
              selectedTime={this.props.time}
              onChange={this.handleTimeGridChange.bind(this)}
              label={this.props.label}
              onClose={this.clickTimerPicker.bind(this)}
              startTime={this.props.startTime}
              endTime={this.props.endTime}
              includeStartTime={this.props.includeStartTime}
              includeEndTime={this.props.includeEndTime}
            />
          </div>
        </div>
      </div>
    );
  }
}

function hour24(hour12, meridiem) {
  if (meridiem === "pm" && hour12 !== 12) {
    return hour12 + 12;
  } else if (meridiem === "am" && hour12 === 12) {
    return 0;
  } else {
    return hour12;
  }
}

TimePicker.parseTimeString = function (ts) {
  let m = ts.match(/^(\d{1,2})(?::(\d{2}))?\s*(a|am|p|pm)?$/);
  if (m) {
    let hstr = m[1];
    let mstr = m[2];
    let meridiem = m[3];
    if (meridiem === "a") meridiem = "am";
    if (meridiem === "p") meridiem = "pm";
    if (hstr && (mstr || meridiem)) {
      let hour = hour24(Number(hstr), meridiem);
      let minute = typeof mstr !== "undefined" ? Number(mstr) : 0;
      return {
        hour,
        minute,
      };
    }
  }
  return null;
};
