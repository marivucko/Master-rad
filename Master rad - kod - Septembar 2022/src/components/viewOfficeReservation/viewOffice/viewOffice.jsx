import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import Office from "../office/office";

const ViewOffice = ({ numOfColumns, numOfRows, matrix }) => {
  const [placesForTable, setPlacesForTable] = useState([]);

  const getNewMatrix = (initialMatrix) => {
    let b = [];
    for (var i = 0; i < numOfRows; i++) {
      let a = [];
      let insertEmptyValue1 =
        initialMatrix === null ||
        initialMatrix.length === 0 ||
        (initialMatrix.length < numOfRows && i >= initialMatrix.length);
      for (var j = 0; j < numOfColumns; j++) {
        let insertEmptyValue =
          insertEmptyValue1 || (initialMatrix[0].length < numOfColumns && j >= initialMatrix[0].length);
        a.push({
          label: insertEmptyValue ? "" : initialMatrix.at(i).at(j).label,
          orientation: insertEmptyValue ? -1 : initialMatrix.at(i).at(j).orientation,
          user: insertEmptyValue ? "" : initialMatrix.at(i).at(j).user,
        });
      }
      b.push(a);
    }
    return b;
  };

  useEffect(() => {
    setPlacesForTable((prevState) => {
      return getNewMatrix(matrix);
    });
  }, [matrix]);

  const countSeats = () => {
    let count = 0;
    for (var i = 0; i < numOfRows; i++) {
      for (var j = 0; j < numOfColumns; j++) {
        if (placesForTable.at(i).at(j).orientation > -1) {
          count++;
        }
      }
    }
    return count;
  };

  return <Office placesForTable={placesForTable} />;
};

export default ViewOffice;
