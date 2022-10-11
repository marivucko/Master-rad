import React, { Component, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { getStringsWorkingDaysOfWeekSelectedByDay } from "../../utils/timeDateHelpter";
import { useTranslation } from "react-i18next";

const AnalysisBarChart = ({ dateObject, statistics, numOfSeats }) => {
  const { t } = useTranslation();
  let numOfUsers = [];
  let numOfUsersWithoutPlace = [];
  statistics?.forEach((e) => {
    numOfUsers.push(e.numOfUsers);
    numOfUsersWithoutPlace.push(e.numOfUsersWithoutPlace);
  });

  const state = {
    labels: getStringsWorkingDaysOfWeekSelectedByDay(dateObject, t),
    datasets: [
      {
        label: t("admin.analysis.bar_chart_first_label"),
        data: numOfUsers,
        backgroundColor: "rgb(46, 83, 110)",
      },
      {
        label: t("admin.analysis.bar_chart_second_label"),
        data: numOfUsersWithoutPlace,
        backgroundColor: "red",
      },
    ],
  };

  return (
    <div style={{ position: "relative", margin: "auto", width: "70vh" }}>
      <Bar
        data={state}
        options={{
          legend: {
            display: true,
            position: "top",
          },
          scales: {
            y: {
              min: 0,
              max: numOfSeats,
            },
          },
        }}
      />
    </div>
  );
};

export default AnalysisBarChart;
