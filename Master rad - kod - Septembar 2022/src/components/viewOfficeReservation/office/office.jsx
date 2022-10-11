import React from "react";
import PlaceForTable from "../placeForTable/placeForTable";
import "./office.css";

const Office = ({ placesForTable }) => {
  return (
    <div>
      {placesForTable.map((row, i) => (
        <div key={i}>
          <div className="column1">
            {row.map((col, j) => (
              <div key={i * row.length + j}>
                <PlaceForTable field={col} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Office;
