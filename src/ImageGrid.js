import React, { useState } from 'react';

const IMG_SIZE = 80;

export default function ImageGrid({ images }) {
  const [imgs, setImgs] = useState(images);

  return (
    <div>
      {imgs.map((img) => (
        <img
          src={img.url}
          style={{ width: IMG_SIZE, height: IMG_SIZE, margin: 4 }}
        />
      ))}
    </div>
  );
}
