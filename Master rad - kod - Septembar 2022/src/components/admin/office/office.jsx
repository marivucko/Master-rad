import React, { useState } from "react";
import PlaceForTable from "../placeForTable/placeForTable";
import { useDrop } from "react-dnd";
import "./office.css";

const Office = ({
  tableOrientation,
  tableOrientation45Angle,
  selectedTableOrientation,
  placesForTable,
  insertTable,
  changeLabel,
  deleteTable,
  showSaveOrUpdate,
}) => {
  return (
    <div>
      {placesForTable.map((row, i) => (
        <div key={i}>
          <div className="column1">
            {row.map((col, j) => (
              <div key={i * row.length + j}>
                <PlaceForTable
                  i={i}
                  j={j}
                  field={col}
                  mainTableOrientation={tableOrientation}
                  mainTableOrientation45Angle={tableOrientation45Angle}
                  insertTableDrop={(elem) => {
                    insertTable(i, j, elem.id);
                  }}
                  insertTableClick={() => {
                    insertTable(i, j, selectedTableOrientation);
                  }}
                  changeLabel={changeLabel}
                  deleteTable={() => {
                    deleteTable(i, j);
                  }}
                  showSaveOrUpdate={showSaveOrUpdate}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Office;
