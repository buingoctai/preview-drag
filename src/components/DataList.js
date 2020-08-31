import React from "react";
import enhance from "../enhance";

import "./style.css";

const IMG_SIZE = 40;

const DataList = ({ data }) => {
  console.log("xxx DataList", data);
  return (
    <div className="flex column list__data__container">
      {data.map((item, index) => (
        <div
          id={index}
          className="flex m-4 item__wrap"
          style={{ background: "lightgray", transform: "translateY(0)" }}
          draggable="true"
        >
          <img
            style={{ width: IMG_SIZE, height: IMG_SIZE, pointerEvents: "none" }}
            className="m-4"
            alt={item.title}
            src={item.thumb}
            draggable="false"
          />
          <div
            className="flex column"
            draggable="false"
            style={{ pointerEvents: "none" }}
          >
            <div style={{ pointerEvents: "none" }}>{item.title}</div>
            <div style={{ pointerEvents: "none" }}>{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default enhance(DataList);
