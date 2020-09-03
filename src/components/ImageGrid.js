import React from "react";
import enhance from "../enhance";
import "./style.css";

const ImageGrid = ({ itemSize, margin, data }) => {
  return (
    <div
      className="list__image__container"
      onDragOver={(event) => {
        if (event.preventDefault) {
          event.preventDefault();
        }
      }}
      onDragEnter={(event) => {
        if (event.preventDefault) {
          event.preventDefault();
        }
      }}
    >
      {data.map((img, index) => (
        <img
          id={index}
          className="img__wrap"
          style={{
            width: itemSize.width,
            height: itemSize.height,
            margin: margin,
            transform: "translate3d(0px,0px,0px)",
            // remove whitespace in break inline
            display: "block",
            float: "left",
            border: 0,
            pointerEvents: "initial",
          }}
          title={index}
          src={img.url}
          alt="images"
          draggable="true"
        />
      ))}
    </div>
  );
};

export default enhance(ImageGrid);
