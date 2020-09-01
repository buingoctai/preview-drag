import React from "react";
import enhance from "../enhance";

import "./style.css";

const DataList = ({ imageSize, margin, data }) => {
  return (
    <div className="flex column list__data__container">
      {data.map((item, index) => (
        <div
          id={index}
          className="flex  item__wrap"
          style={{
            background: "lightgray",
            transform: "translate3d(0px,0px,0px)",
            margin: margin,
          }}
          draggable="true"
        >
          <img
            style={{
              width: imageSize,
              height: imageSize,
              pointerEvents: "none",
            }}
            className="m-4"
            alt={item.title}
            src={item.thumb}
          />

          <div className="flex column" style={{ pointerEvents: "none" }}>
            <div style={{ pointerEvents: "none" }}>{item.title}</div>
            <div style={{ pointerEvents: "none" }}>{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default enhance(DataList);
