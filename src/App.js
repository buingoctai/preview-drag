import React from 'react';

import ImageGrid from './ImageGrid';
import DataList from './DataList';

import EXAMPLE_IMAGES from './data';

const EXAMPLE_DATA = EXAMPLE_IMAGES.slice(10).map((img, index) => ({
  thumb: img.url,
  title: `Title ${index}`,
  sub: `Sub ${index}`,
}));

function App() {
  function handleIndexUpdate(oldIndex, newIndex) {
    console.log('handleIndexUpdate', oldIndex, newIndex);
  }

  return [
    <ImageGrid images={EXAMPLE_IMAGES} onIndexUpdate={handleIndexUpdate} />,
    <DataList data={EXAMPLE_DATA} onIndexUpdate={handleIndexUpdate} />,
  ];
}

export default App;
