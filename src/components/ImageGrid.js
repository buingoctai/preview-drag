import React from "react";
import enhance from "../enhance";
import "./style.css";

const IMG_SIZE = 80;
const ImageGrid = ({ data, onClickItem }) => {
  console.log("xxx ImageGrid", data);
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
          onClick={() => onClickItem()}
        />
      ))}
    </div>
  );
};

export default enhance(ImageGrid);
