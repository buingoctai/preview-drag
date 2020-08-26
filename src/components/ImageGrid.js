import React from "react";
import enhance from "../enhance";
import "./style.css";

const IMG_SIZE = 80;
const ImageGrid = ({ data }) => {
  return (
    <div className="list__image__container">
      {data.map((img, index) => (
        <img
          id={index}
          className="img__wrap"
          style={{
            width: IMG_SIZE,
            height: IMG_SIZE,
            margin: 4,
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
