import React from "react";

import ImageGrid from "./components/ImageGrid";
import DataList from "./components/DataList";

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

  const ROW_WIDTH = 800;
  const MARGIN = 4;
  const WIDTH_ITEM_GRID = 40;
  const HEIGHT_ITEM_GRID = 40;

  const WIDTH_ITEM_LIST = 60;
  const HEIGHT_ITEM_LIST = 50;

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
          movingUnit={{
            width: WIDTH_ITEM_GRID + 2 * MARGIN,
            height: HEIGHT_ITEM_GRID + 2 * MARGIN,
          }}
          itemSize={{ width: WIDTH_ITEM_GRID, height: HEIGHT_ITEM_GRID }}
          margin={MARGIN}
          numItemRow={Math.floor(ROW_WIDTH / (WIDTH_ITEM_GRID + 2 * MARGIN))}
          handleIndexUpdate={handleIndexUpdate}
        />
        <DataList
          displayStyle="list"
          className="list__data__container"
          subClassName="item__wrap"
          dataList={EXAMPLE_DATA}
          movingUnit={{
            width: WIDTH_ITEM_LIST + 4 * MARGIN,
            height: HEIGHT_ITEM_LIST + 4 * MARGIN,
          }}
          itemSize={{ width: WIDTH_ITEM_LIST, height: HEIGHT_ITEM_LIST }}
          margin={MARGIN}
          handleIndexUpdate={handleIndexUpdate}
        />
      </div>
    </div>
  );
}

export default App;
