import React from "react";
import "./buttonTableOrientation.css";
import { useDrag } from "react-dnd";
import HoverElement from "../../hoverElement/hoverElement";

const ButtonTableOrientation = ({ tableOrientation, rotateTable, onClick, selectedTableOrientation }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "buttonTable",
    item: { id: 0 },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    onDragStart: () => {
      console.log("start");
    },
  }));
  return (
    <div className="table_orient_and_button">
      <div
        className="table_orient_frame"
        style={{
          border: isDragging
            ? "2.5px solid rgb(46, 83, 110)"
            : selectedTableOrientation
            ? "0.5px solid rgb(46, 83, 110)"
            : "0px",
        }}
      >
        <button
          ref={drag}
          className={" table_orient deg" + String(tableOrientation * 90)}
          onClick={onClick}
          onMouseDown={onClick}
          onDoubleClick={rotateTable}
        ></button>
      </div>
      <HoverElement
        body={<button className="bi bi-arrow-counterclockwise rotate_button" onClick={rotateTable} />}
        text={"Rotate table"}
      />
    </div>
  );
};

export default ButtonTableOrientation;
