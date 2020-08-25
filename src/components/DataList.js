import React, { useState } from 'react';

const IMG_SIZE = 40;

export default function DataList({ data }) {
  const [items, setItems] = useState(data);

  return (
    <div className="flex column">
      {items.map((item) => (
        <div className="flex m-4" style={{ background: 'lightgray' }}>
          <img
            src={item.thumb}
            className="m-4"
            alt={item.title}
            style={{ width: IMG_SIZE, height: IMG_SIZE }}
          />
          <div className="flex column">
            <div>{item.title}</div>
            <div>{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
