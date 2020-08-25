import React from "react";
import "./style.css";

const IMG_SIZE = 80;

export default function ImageGrid({ images }) {
  return (
    <div className="list__image__container">
      {images.map((img, index) => (
        <img
          id={index}
          style={{ width: IMG_SIZE, height: IMG_SIZE, margin: 4 }}
          title={index}
          src={img.url}
          alt="image"
          draggable="true"
        />
      ))}
    </div>
  );
}
