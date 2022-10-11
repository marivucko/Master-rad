import React, { useState } from "react";
import "./placeForTable.css";
import { useDrop } from "react-dnd";

const PlaceForTable = ({
  i,
  j,
  field,
  mainTableOrientation,
  mainTableOrientation45Angle,
  insertTableDrop,
  insertTableClick,
  changeLabel,
  deleteTable,
  showSaveOrUpdate,
}) => {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ["buttonTable", "buttonTable45Angle"],
      drop: insertTableDrop,
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [mainTableOrientation, mainTableOrientation45Angle]
  );
  return (
    <div
      ref={drop}
      style={{
        height: "100px",
        width: "100px",
      }}
    >
      <div className="container-two">
        {showSaveOrUpdate > 0 && (
          <input
            className="label-text"
            style={{ visibility: field.orientation >= 0 ? "visible" : "hidden" }}
            value={field.label}
            onChange={(e) => {
              changeLabel(i, j, e.target.value);
            }}
          ></input>
        )}
        {showSaveOrUpdate == 0 && (
          <div
            className="label-text"
            style={{ visibility: field.orientation >= 0 ? "visible" : "hidden", padding: "0.1rem" }}
          >
            {field.label}
          </div>
        )}
        <div
          className={field.orientation >= 0 ? `table deg` + String(field.orientation * 90) : `empty`}
          onClick={() => {
            if (showSaveOrUpdate !== 0) insertTableClick();
          }}
        ></div>
        <button
          className="bi bi-trash-fill"
          style={{
            visibility: showSaveOrUpdate > 0 && field.orientation >= 0 ? "visible" : "hidden",
            position: "absolute",
            bottom: "0",
            right: "0",
            zIndex: "100",
          }}
          onClick={deleteTable}
        />
      </div>
    </div>
  );
};

export default PlaceForTable;
