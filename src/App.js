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

  const ROW_WIDTH = 800;
  const MARGIN = 4;
  return (
    <div className="flex column align-center justify-center">
      <div
        style={{ width: ROW_WIDTH, display: "flex", flexDirection: "column" }}
      >
        <ImageGrid
          displayStyle="grid"
          className="list__image__container"
          subClassName="img__wrap"
          dataList={EXAMPLE_IMAGES}
          rowWidth={ROW_WIDTH}
          margin={MARGIN}
          imageSize={80}
          handleIndexUpdate={handleIndexUpdate}
        />
        <DataList
          displayStyle="list"
          className="list__data__container"
          subClassName="item__wrap"
          dataList={EXAMPLE_DATA}
          margin={MARGIN}
          imageSize={40}
          handleIndexUpdate={handleIndexUpdate}
        />
      </div>
    </div>
  );
}

export default App;
