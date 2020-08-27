import React from "react";

import ImageGrid from "./components/ImageGrid";
import DataList from "./components/DataList";

import EXAMPLE_IMAGES from "./data";

const EXAMPLE_DATA = EXAMPLE_IMAGES.slice(10).map((img, index) => ({
  thumb: img.url,
  title: `Title ${index}`,
  sub: `Sub ${index}`,
}));

function App(props) {
  function handleIndexUpdate(oldIndex, newIndex) {
    console.log("handleIndexUpdate", oldIndex, newIndex);
  }

  return (
    <div className="flex column align-center justify-center">
      <div style={{ width: 800 }}>
        <ImageGrid
          className="list__image__container"
          subClassName="img__wrap"
          dataList={EXAMPLE_IMAGES}
          handleIndexUpdate={handleIndexUpdate}
        />
        <DataList
          className="list__data__container"
          subClassName="item__wrap"
          dataList={EXAMPLE_DATA}
          handleIndexUpdate={handleIndexUpdate}
        />
      </div>
    </div>
  );
}

export default App;
