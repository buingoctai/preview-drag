import React, { useState } from 'react';

const IMG_SIZE = 40;

export default function DataList({ data }) {
  const [items, setItems] = useState(data);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {items.map((item) => (
        <div style={{ display: 'flex', background: 'lightgray', margin: 4 }}>
          <img
            src={item.thumb}
            style={{ width: IMG_SIZE, height: IMG_SIZE, margin: 4 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div>{item.title}</div>
            <div>{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
