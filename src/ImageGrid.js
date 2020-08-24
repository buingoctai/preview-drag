import React, { useState } from 'react';

import EXAMPLE_IMAGES from './data';

const IMG_SIZE = 80;

export default function ImageGrid() {
  const [imgs, setImgs] = useState(EXAMPLE_IMAGES);

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
