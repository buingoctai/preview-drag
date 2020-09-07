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
  const SPACE = 6;
  const WIDTH_ITEM_GRID = 50;
  const HEIGHT_ITEM_GRID = 50;

  const WIDTH_ITEM_LIST = 40;
  const HEIGHT_ITEM_LIST = 40;

  return (
    <div className="flex column align-center justify-center">
      <div
        style={{ width: ROW_WIDTH, display: "flex", flexDirection: "column" }}
      >
        <ImageGrid
          className="list__image__container"
          subClassName="img"
          dataList={EXAMPLE_IMAGES}
          movingUnit={{
            width: WIDTH_ITEM_GRID + 2 * SPACE,
            height: HEIGHT_ITEM_GRID + 2 * SPACE,
          }}
          itemSize={{ width: WIDTH_ITEM_GRID, height: HEIGHT_ITEM_GRID }}
          space={SPACE}
          numItemRow={Math.floor(ROW_WIDTH / (WIDTH_ITEM_GRID + 2 * SPACE))}
          handleIndexUpdate={handleIndexUpdate}
        />
        <DataList
          className="list__data__container"
          subClassName="item__wrap"
          dataList={EXAMPLE_DATA}
          movingUnit={{
            width: WIDTH_ITEM_LIST + 2 * SPACE,
            height: HEIGHT_ITEM_LIST + 2 * SPACE,
          }}
          itemSize={{ width: WIDTH_ITEM_LIST, height: HEIGHT_ITEM_LIST }}
          space={SPACE}
          handleIndexUpdate={handleIndexUpdate}
        />
      </div>
    </div>
  );
}

export default App;
