import React from "react";
import enhance from "../enhance";

import "./style.css";

const IMG_SIZE = 40;

const DataList = ({ data }) => {
  return (
    <div className="flex column list__data__container">
      {data.map((item, index) => (
        <div
          id={index}
          className="flex m-4"
          style={{ background: "lightgray" }}
          draggable="true"
        >
          <img
            style={{ width: IMG_SIZE, height: IMG_SIZE }}
            className="m-4"
            alt={item.title}
            src={item.thumb}
            draggable="false"
          />
          <div className="flex column" draggable="false">
            <div>{item.title}</div>
            <div>{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default enhance(DataList);
