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
        parentClass="list__image__container"
        childClass="img"
        dataList={EXAMPLE_IMAGES}
        movingUnit={{
          width: WIDTH_ITEM_GRID + 2 * SPACE,
          height: HEIGHT_ITEM_GRID + 2 * SPACE,
        }}
        itemSize={{ width: WIDTH_ITEM_GRID, height: HEIGHT_ITEM_GRID }}
        space={SPACE}
        numItemRow={Math.floor(ROW_WIDTH / (WIDTH_ITEM_GRID + 2 * SPACE))}
        handleIndexUpdate={handleIndexUpdate}
        displayType="grid"
      />
      <DataList
        parentClass="list__data__container"
        childClass="item__wrap"
        dataList={EXAMPLE_DATA}
        movingUnit={{
          width: WIDTH_ITEM_LIST + 2 * SPACE,
          height: HEIGHT_ITEM_LIST + 2 * SPACE,
        }}
        itemSize={{ width: WIDTH_ITEM_LIST, height: HEIGHT_ITEM_LIST }}
        space={SPACE}
        handleIndexUpdate={handleIndexUpdate}
        displayType="list"
      />
    </div>
  );
}

export default App;
