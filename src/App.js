import React from 'react';

import ImageGrid from './ImageGrid';

import EXAMPLE_IMAGES from './data';

function App() {
  function handleIndexUpdate(oldIndex, newIndex) {
    console.log('handleIndexUpdate', oldIndex, newIndex);
  }

  return (
    <ImageGrid images={EXAMPLE_IMAGES} onIndexUpdate={handleIndexUpdate} />
  );
}

export default App;
