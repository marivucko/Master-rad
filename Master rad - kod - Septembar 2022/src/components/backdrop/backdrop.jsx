import React from "react";
import "./backdrop.css";
const BackDrop = ({ sideBar, closeSideBar }) => {
  return <div className={sideBar ? "back-drop back-drop--open" : "back-drop"} onClick={closeSideBar}></div>;
};

export default BackDrop;
