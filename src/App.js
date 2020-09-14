import React from "react";

import ImageGrid from "./components/ImageGrid";
import DataList from "./components/DataList";
import {
  ROW_WIDTH,
  SPACE,
  WIDTH_ITEM_GRID,
  HEIGHT_ITEM_GRID,
  WIDTH_ITEM_LIST,
  HEIGHT_ITEM_LIST,
} from "./utils/constants";

import EXAMPLE_IMAGES from "./data";

const EXAMPLE_DATA = EXAMPLE_IMAGES.map((img, index) => ({
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
      <ImageGrid
        dataList={EXAMPLE_IMAGES}
        itemSize={{ width: WIDTH_ITEM_GRID, height: HEIGHT_ITEM_GRID }}
        rowWidth={ROW_WIDTH}
        space={SPACE}
        handleIndexUpdate={handleIndexUpdate}
      />
      <DataList
        dataList={EXAMPLE_DATA}
        itemSize={{ width: WIDTH_ITEM_LIST, height: HEIGHT_ITEM_LIST }}
        rowWidth={ROW_WIDTH}
        space={SPACE}
        handleIndexUpdate={handleIndexUpdate}
      />
    </div>
  );
}

export default App;
